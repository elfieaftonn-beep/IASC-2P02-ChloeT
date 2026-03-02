import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';

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
scene.background = new THREE.Color('#ffffff');
scene.fog = new THREE.Fog('#0a0a0a', 10, 50);

// Cameras
const insideCamera = new THREE.PerspectiveCamera(75, sizes.aspectRatio, 0.1, 100);
insideCamera.position.set(0, 2, 0.5);  // Looking at the wall from inside
insideCamera.lookAt(0, 2, -5);

const outsideCamera = new THREE.PerspectiveCamera(75, sizes.aspectRatio, 0.1, 100);
outsideCamera.position.set(20, 5, 8);  // Bird's eye view of the whole scene

let activeCamera = insideCamera;
scene.add(insideCamera);
scene.add(outsideCamera);

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});
renderer.setSize(sizes.width, sizes.height);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Controls (for outside view only)
const controls = new OrbitControls(outsideCamera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.target.set(0, 3, 0);

/*
** CAVE STRUCTURE **
*/

// Cave wall (where shadows are cast)
const wallGeometry = new THREE.PlaneGeometry(20, 10);
const wallMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#acacac'),
    roughness: 0.9,
    metalness: 0.1
});
const caveWall = new THREE.Mesh(wallGeometry, wallMaterial);
caveWall.position.set(0, 3, -8);
caveWall.receiveShadow = true;
scene.add(caveWall);

// Cave floor
const floorGeometry = new THREE.PlaneGeometry(20, 20);
const floorMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#2a2a2a'),
    roughness: 0.95
});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI * 0.5;
floor.receiveShadow = true;
scene.add(floor);

// Cave ceiling
const ceiling = new THREE.Mesh(floorGeometry, floorMaterial);
ceiling.rotation.x = Math.PI * 0.5;
ceiling.position.y = 8;
ceiling.receiveShadow = true;
scene.add(ceiling);

// Side walls
const sideWallGeometry = new THREE.PlaneGeometry(20, 10);
const leftWall = new THREE.Mesh(sideWallGeometry, wallMaterial);
leftWall.rotation.y = Math.PI * 0.5;
leftWall.position.set(-10, 3, 2);
leftWall.receiveShadow = true;
scene.add(leftWall);

const rightWall = new THREE.Mesh(sideWallGeometry, wallMaterial);
rightWall.rotation.y = -Math.PI * 0.5;
rightWall.position.set(10, 3, 2);
rightWall.receiveShadow = true;
scene.add(rightWall);

/*
** 3D OBJECTS (that cast shadows) **
*/

// Bird object
const birdBodyGeometry = new THREE.SphereGeometry(0.5, 16, 16);
const birdMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#ff8026'),
    roughness: 0.7
});
const birdBody = new THREE.Mesh(birdBodyGeometry, birdMaterial);
birdBody.position.set(2, 4, 5);
birdBody.castShadow = true;

// Bird wings
const wingGeometry = new THREE.BoxGeometry(1.5, 0.1, 0.5);
const leftWing = new THREE.Mesh(wingGeometry, birdMaterial);
leftWing.position.set(-0.5, 0, 0);
leftWing.castShadow = true;
const rightWing = new THREE.Mesh(wingGeometry, birdMaterial);
rightWing.position.set(0.5, 0, 0);
rightWing.castShadow = true;

const birdGroup = new THREE.Group();
birdGroup.add(birdBody);
birdGroup.add(leftWing);
birdGroup.add(rightWing);
birdGroup.position.set(2, 4, 5);
scene.add(birdGroup);

// Vase object
const vaseGeometry = new THREE.CylinderGeometry(0.5, 0.8, 1.5, 16);
const vaseMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#ffe172'),
    roughness: 0.6
});
const vase = new THREE.Mesh(vaseGeometry, vaseMaterial);
vase.position.set(-2, 4, 5);
vase.castShadow = true;
scene.add(vase);

// Human figure (simple representation)
const humanGroup = new THREE.Group();

const headGeometry = new THREE.SphereGeometry(0.3, 16, 16);
const humanMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#d2691e'),
    roughness: 0.8
});
const head = new THREE.Mesh(headGeometry, humanMaterial);
head.position.y = 1.5;
head.castShadow = true;

const bodyGeometry = new THREE.CylinderGeometry(0.4, 0.5, 1.2, 16);
const body = new THREE.Mesh(bodyGeometry, humanMaterial);
body.position.y = 0.6;
body.castShadow = true;

humanGroup.add(head);
humanGroup.add(body);
humanGroup.position.set(0, 3, 6);
scene.add(humanGroup);

/*
** LIGHT SOURCES **
*/

// Fire light (main light that creates shadows)
const fireLight = new THREE.PointLight('#ff6600', 2, 30);
fireLight.position.set(0, 3, 8);
fireLight.castShadow = true;
fireLight.shadow.mapSize.width = 2048;
fireLight.shadow.mapSize.height = 2048;
fireLight.shadow.camera.near = 0.5;
fireLight.shadow.camera.far = 30;
scene.add(fireLight);

// Fire glow effect
const fireGlowGeometry = new THREE.SphereGeometry(0.5, 16, 16);
const fireGlowMaterial = new THREE.MeshBasicMaterial({
    color: '#ff9147',
    transparent: true,
    opacity: 0.6
});
const fireGlow = new THREE.Mesh(fireGlowGeometry, fireGlowMaterial);
fireGlow.position.copy(fireLight.position);
scene.add(fireGlow);

// Ambient light (very subtle)
const ambientLight = new THREE.AmbientLight('#ffffff', 0.1);
scene.add(ambientLight);

/*
** ANIMATION STATE **
*/

const animations = {
    'shadow-dance': false,
    'shadow-morph': false,
    'object-float': false,
    'bird-flight': false
};

let currentAnimation = null;

/*
** ANIMATION FUNCTIONS **
*/

function shadowDance(elapsedTime) {
    // Make objects sway back and forth
    vase.position.x = -2 + Math.sin(elapsedTime * 2) * 1.5;
    humanGroup.position.x = Math.cos(elapsedTime * 1.5) * 2;

    // Fire flickers
    fireLight.intensity = 2 + Math.sin(elapsedTime * 5) * 0.3;
}

function shadowMorph(elapsedTime) {
    // Objects rotate and change position dramatically
    birdGroup.rotation.y = elapsedTime;
    vase.rotation.z = Math.sin(elapsedTime) * 0.5;
    humanGroup.scale.y = 1 + Math.sin(elapsedTime * 2) * 0.3;

    // Move objects closer and farther from wall
    vase.position.z = 5 + Math.sin(elapsedTime * 1.5) * 2;
}

function objectFloat(elapsedTime) {
    // Objects float up and down gracefully
    vase.position.y = 4 + Math.sin(elapsedTime * 1.2) * 1.5;
    humanGroup.position.y = 3 + Math.cos(elapsedTime * 1.5) * 1;
    birdGroup.position.y = 4 + Math.sin(elapsedTime * 0.8) * 2;
}

function birdFlight(elapsedTime) {
    // Bird flies in a circular path
    const radius = 4;
    birdGroup.position.x = Math.cos(elapsedTime * 0.8) * radius;
    birdGroup.position.z = 5 + Math.sin(elapsedTime * 0.8) * radius;
    birdGroup.position.y = 4 + Math.sin(elapsedTime * 2) * 0.5;

    // Rotate bird to face direction of movement
    birdGroup.rotation.y = elapsedTime * 0.8;

    // Flap wings
    leftWing.rotation.z = Math.sin(elapsedTime * 10) * 0.5;
    rightWing.rotation.z = -Math.sin(elapsedTime * 10) * 0.5;
}

function resetObjectPositions() {
    // Reset all objects to original positions
    birdGroup.position.set(2, 4, 5);
    birdGroup.rotation.set(0, 0, 0);
    leftWing.rotation.set(0, 0, 0);
    rightWing.rotation.set(0, 0, 0);

    vase.position.set(-2, 4, 5);
    vase.rotation.set(0, 0, 0);

    humanGroup.position.set(0, 3, 6);
    humanGroup.rotation.set(0, 0, 0);
    humanGroup.scale.set(1, 1, 1);

    fireLight.intensity = 2;
}

/*
** EVENT LISTENERS **
*/

// Animation link clicks
document.querySelectorAll('.animation-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const animationType = link.getAttribute('data-animation');

        // Toggle animation
        if (currentAnimation === animationType) {
            currentAnimation = null;
            resetObjectPositions();
            document.querySelectorAll('.animation-link').forEach(l => l.classList.remove('active'));
        } else {
            currentAnimation = animationType;
            document.querySelectorAll('.animation-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        }
    });
});

// Camera view switching
document.querySelectorAll('.view-switch').forEach(button => {
    button.addEventListener('click', () => {
        const view = button.getAttribute('data-view');

        if (view === 'inside') {
            activeCamera = insideCamera;
            controls.enabled = false;
        } else if (view === 'outside') {
            activeCamera = outsideCamera;
            controls.enabled = true;
        }
    });
});

// Window resize
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    sizes.aspectRatio = sizes.width / sizes.height;

    insideCamera.aspect = sizes.aspectRatio;
    insideCamera.updateProjectionMatrix();

    outsideCamera.aspect = sizes.aspectRatio;
    outsideCamera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/*
** ANIMATION LOOP **
*/

const clock = new THREE.Clock();

function animate() {
    const elapsedTime = clock.getElapsedTime();

    // Run current animation if one is active
    if (currentAnimation) {
        switch(currentAnimation) {
            case 'shadow-dance':
                shadowDance(elapsedTime);
                break;
            case 'shadow-morph':
                shadowMorph(elapsedTime);
                break;
            case 'object-float':
                objectFloat(elapsedTime);
                break;
            case 'bird-flight':
                birdFlight(elapsedTime);
                break;
        }
    }

    // Fire glow pulse
    fireGlow.scale.setScalar(1 + Math.sin(elapsedTime * 3) * 0.1);

    // Update controls
    if (activeCamera === outsideCamera) {
        controls.update();
    }

    // Render
    renderer.render(scene, activeCamera);

    // Request next frame
    requestAnimationFrame(animate);
}

animate();