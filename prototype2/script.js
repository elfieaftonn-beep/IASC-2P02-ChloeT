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
controls.enableDamping = true

/*
** MESHES **
*/

//TestSphere 
const boxGeometry = new THREE.BoxGeometry(1)
const boxMaterial = new THREE.MeshNormalMaterial()
const box = new THREE.Mesh(boxGeometry, boxMaterial)




scene.add(box)

// plane 
const planeGeometry = new THREE.PlaneGeometry(10,10, 20, 20)
const planeMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color('white'),
    side: THREE.DoubleSide,
    wireframe: true
    
})
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
plane.rotation.x = Math.PI * 0.5

scene.add(plane)
//* UI ** //
const gui = new dat.GUI()

//UI object
const uiObject = {
    speed: 1,
    distance: 1,
    rotSpeed: 1
}

//box ui
const boxFolder = gui.addFolder('box')

boxFolder
    .add(uiObject, 'speed')
    .min(0.1)
    .max(10)
    .step(0.1)
    .name('speed')

boxFolder
    .add(uiObject, 'distance')
    .min(0.1)
    .max(10)
    .step(0.1)
    .name('distance')
boxFolder
    .add(uiObject, 'rotSpeed')
    .min(0.1)
    .max(10)
    .step(0.1)
    .name('rotation speed')

//plane ui
const planeFolder = gui.addFolder('plane')
planeFolder
    .add(plane.material, 'wireframe')
    .name('toggle wireframe')

/*
** ANIMATION LOOP **
*/

const clock = new THREE.Clock();
const animation = () => {
    // Return elapsed time
    const elapsedTime = clock.getElapsedTime()

    //Animate Box
    box.position.y = Math.cos(elapsedTime * uiObject.speed) * uiObject.distance
    box.rotation.y += 0.01 * uiObject.rotSpeed
    box.rotation.x += 0.01 * uiObject.rotSpeed
    box.rotation.z += 0.01 * uiObject.rotSpeed

    // Update Controls
    controls.update()

    //Renderer
    renderer.render(scene, camera)

    //Request Next Frame
    window.requestAnimationFrame(animation)

}

animation()
