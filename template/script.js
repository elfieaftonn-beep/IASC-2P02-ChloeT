import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';
import * as dat from 'lil-gui';
/**** 
 * SETUP * 
 */

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    aspectRatio: window.innerWidth / window.innerHeight
}

// resizing 

window.addEventListener('resize', () =>
{
    // Update Sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    sizes.aspectRatio = window.innerWidth / window.innerHeight
   
    // Update Camera
    camera.aspect = sizes.aspectRatio
    camera.updateProjectionMatrix()

    // Update Renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/*********
 * Scene *
 */

// Canvas 
const canvas = document.querySelector('.webgl');


// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color('pink')



//Camera
const camera = new THREE.PerspectiveCamera(
    75,
     sizes.aspectRatio, 
    0.1,
    100
)
scene.add(camera)
camera.position.set(0,0,5)

//renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})

renderer.setSize(sizes.width, sizes.height)

// Controls 
const controls = new OrbitControls(camera, canvas)
/*
** MESHES **
*/

//TestSphere 
const testSphereGeometry = new THREE.SphereGeometry(1)
const sphereMaterial = new THREE.MeshNormalMaterial()
const testSphere = new THREE.Mesh(testSphereGeometry, sphereMaterial)


scene.add(testSphere)

//* UI ** //
const gui = new dat.GUI()






/*
** ANIMATION LOOP **
*/

const clock = new THREE.Clock();
const animation = () => {
    // Return elapsed time
    const elapsedTime = clock.getElapsedTime()

    // Update Controls
    controls.update()

    //Renderer
    renderer.render(scene, camera)

    //Request Next Frame
    window.requestAnimationFrame(animation)

}

animation()
