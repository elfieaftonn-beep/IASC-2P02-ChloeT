import * as THREE from 'three';

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
     window.innerWidth / window.innerHeight,
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

renderer.setSize(window.innerWidth, window.innerHeight)

/*
** MESHES **
*/

//TestSphere 
const testSphereGeometry = new THREE.SphereGeometry(1)
const sphereMaterial = new THREE.MeshNormalMaterial()
const testSphere = new THREE.Mesh(testSphereGeometry, sphereMaterial)


scene.add(testSphere)





/*
** ANIMATION LOOP **
*/

const clock = new THREE.Clock();
const animation = () => {
    // Return elapsed time

    //Renderer
    renderer.render(scene, camera)

    //Request Next Frame
    window.requestAnimationFrame(animation)

}

animation()
