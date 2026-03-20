import * as THREE from 'three';
import * as dat from "lil-gui";
import { OrbitControls } from "OrbitControls";

/***********
 ** Setup **
 **********/

//Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    aspectRatio: window.innerWidth / window.innerHeight
}

//Resizing
window.addEventListener('resize', () => 
{
    //Update Sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    sizes.aspectRatio = window.innerWidth / window/innerHeight

    //update camera
    camera.aspect = sizes.aspectRatio
    camera.updateProjectionMatrix()

    //update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/************
 ** SCENE **
************/

//Canvas
const canvas = document.querySelector('.webgl')

//Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color('pink')

//Camera
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.aspectRatio,
    0.1,
    100
)
scene.add(camera)
camera.position.set(0, 12, -20)

//Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/*********
 * Lights *
 ********/
//Directional light
const directionalLight = new THREE.DirectionalLight(0x404040, 100)
scene.add(directionalLight)

/*************
 ** MESHES **
*************/
// Cube geometry
const cubeGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)


const drawCube = (height, color) => 
{
    //Create cube material
    const cubeMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(color)
    })

    //Create cube
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)

    //cube position
    cube.position.x = (Math.random() - 0.5)*10
    cube.position.z = (Math.random() - 0.5)*10
    cube.position.y = height - 10

    //randomize cube position
    cube.rotation.x = Math.random() * 2 * Math.PI
    cube.rotation.y = Math.random() * 2 * Math.PI
    cube.rotation.z = Math.random() * 2 * Math.PI

    //add cube to scene
    scene.add(cube)
}

/********
 ** UI **
 *******/
//UI
const ui = new dat.GUI()

let preset = {}

const uiObj = {
    sourceText: "",
    saveSourceText() {
        saveSourceText()
    },
    term1: '',
    colour1: '',
    term2: '',
    colour2: '',
    term3: '',
    colour3: '',
    saveTerms() {
        saveTerms()
    }
}

// UI Functions
const saveSourceText = () => {
    //UI
    preset = ui.save()
    textFolder.hide()
    termsFolder.show()
    visualizeFolder.show()

    //Text analysis
    tokenizeSourceText(uiObj.sourceText)
}

const saveTerms = () => {
    //UI
    preset = ui.save()
    visualizeFolder.hide()

    //Text Analysis
    findSearchTermInTokenizedText(uiObj.term1, uiObj.colour1)
    findSearchTermInTokenizedText(uiObj.term2, uiObj.colour2)
    findSearchTermInTokenizedText(uiObj.term3, uiObj.colour3)
}

//Text folder
const textFolder = ui.addFolder("Source Text")

textFolder
    .add(uiObj, 'sourceText')
    .name("Source Text")

textFolder
    .add(uiObj, 'saveSourceText')
    .name("Save")

//Terms and visualize folders
const termsFolder = ui.addFolder("Search Terms")
const visualizeFolder = ui.addFolder("Visualise")

termsFolder
    .add(uiObj, 'term1')
    .name("Term 1")

termsFolder
    .addColor(uiObj, 'colour1')
    .name("Colour 1")

termsFolder
    .add(uiObj, 'term2')
    .name("Term 2")

termsFolder
    .addColor(uiObj, 'colour2')
    .name("Colour 2")

termsFolder
    .add(uiObj, 'term3')
    .name("Term 3")

termsFolder
    .addColor(uiObj, 'colour3')
    .name("Colour 3")

visualizeFolder
    .add(uiObj, 'saveTerms')
    .name("Visualize")

//terms and visualise folders are hidden by default
termsFolder.hide()
visualizeFolder.hide()

/*******************
 ** Text Analysis **
********************/
//Variables
let parsedText, tokenizedText

//Parse and Tokenize Source Text
const tokenizeSourceText = (sourceText) => 
{
    //Strip periods and downcase source text
    parsedText = sourceText.replaceAll(".", "").toLowerCase()

    //Tokenize text
    tokenizedText = parsedText.split(/[^\w']+/)
}

//find search term in tokenized text
const findSearchTermInTokenizedText = (term, color) => 
{
    //Use a for loop to go through tokenized text
    for (let i=0; i < tokenizedText.length; i++) {
        //if tokenizedText[i] matches the search term, draw a cube
        if(tokenizedText[i] === term) {
            //convert i into height, which is a value between 1 and 20
            const height = (100/tokenizedText.length)*i*0.2

            //call drawCube function 100 times using converted height value
            for(let a = 0; a < 100; a++) {
                drawCube(height, color)
            }
        }
    }
}

/*********************
 ** ANIMATION LOOP **
*********************/

const clock = new THREE.Clock()

const animation = () => {
    //Return elapsed time
    const elapsedTime = clock.getElapsedTime()

    //Update OrbitControls
    controls.update()

    //Renderer
    renderer.render(scene, camera)

    //Request next frame
    window.requestAnimationFrame(animation)
}

animation()
