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
scene.background = new THREE.Color('black')



//Camera
const camera = new THREE.PerspectiveCamera(
    75,
     sizes.aspectRatio, 
    0.1,
    100
)
scene.add(camera)
camera.position.set(10,2,7.5)

//renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})

renderer.setSize(sizes.width, sizes.height)
renderer.shadowMap.enabled = true;  
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Controls 
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/*
** MESHES **

*/


//cave
const caveGeometry = new THREE.PlaneGeometry(15.5, 7.5)
const caveMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('white'),
    side: THREE.DoubleSide
})
const cave = new THREE.Mesh(caveGeometry, caveMaterial)
cave.rotation.y = Math.PI * 0.5
cave.receiveShadow = true
scene.add(cave)

//objects
const SphereGeometry = new THREE.SphereGeometry()
const SphereMaterial = new THREE.MeshNormalMaterial()
const leftEye = new THREE.Mesh(SphereGeometry, SphereMaterial)
const rightEye = new THREE.Mesh(SphereGeometry, SphereMaterial)
leftEye.position.set(6, 3, -2.5)
leftEye.castShadow = true
scene.add(leftEye)
rightEye.position.set(6, 3, 2.5)
rightEye.castShadow = true
scene.add(rightEye)

const smileGeometry = new THREE.TorusGeometry( 1, 0.4, 12, 48, Math.PI );
const smileMaterial = new THREE.MeshNormalMaterial();
const smile = new THREE.Mesh( smileGeometry, smileMaterial );
smile.rotation.y = Math.PI*0.5
smile.rotation.x = Math.PI
smile.position.set(6, 0, 0)
smile.castShadow = true
scene.add(smile);

/* Lights *
*/

//directional light
const directionalLight = new THREE.DirectionalLight(
    new THREE.Color('white'),
    0.5
)
scene.add(directionalLight)
directionalLight.position.set(20, 4.1, 0)
directionalLight.target = cave
directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 512
directionalLight.shadow.mapSize.height = 512

//directional light helper
//const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight)
//scene.add(directionalLightHelper) 


//* UI ** //
const gui = new dat.GUI()
const lightPositionFolder = gui.addFolder('Light position')
lightPositionFolder
    .add(directionalLight.position, 'y')
    .min(-10)
    .max(10)
    .step(0.1)
    .name("Y")

lightPositionFolder
    .add(directionalLight.position, 'z')
    .min(-10)
    .max(10)
    .step(0.1)
    .name('Z')



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
    
    //update directional light helper
    //directionalLightHelper.update()



    //Request Next Frame
    window.requestAnimationFrame(animation)

}

animation()
