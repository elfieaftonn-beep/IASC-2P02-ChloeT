import * as THREE from 'three';
import * as dat from "lil-gui";
import { OrbitControls } from "OrbitControls";

/***********
 ** SETUP **
 ***********/
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    aspectRatio: window.innerWidth / window.innerHeight
}

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    sizes.aspectRatio = window.innerWidth / window.innerHeight
    camera.aspect = sizes.aspectRatio
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/***********
 ** SCENE **
 ***********/
const canvas = document.querySelector('.webgl')
const scene = new THREE.Scene()
scene.background = new THREE.Color('#08080f')
scene.fog = new THREE.FogExp2('#08080f', 0.022)

const camera = new THREE.PerspectiveCamera(75, sizes.aspectRatio, 0.1, 100)
scene.add(camera)
camera.position.set(0, 4, -22)

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.dampingFactor = 0.04
controls.target.set(0, 2, 0)

/***********
 ** LIGHTS **
 ***********/
scene.add(new THREE.AmbientLight(0xffffff, 0.5))

const dirLight = new THREE.DirectionalLight(0x99bbff, 55)
dirLight.position.set(4, 18, -8)
scene.add(dirLight)

const warmLight = new THREE.DirectionalLight(0xffddaa, 14)
warmLight.position.set(-12, 4, 12)
scene.add(warmLight)


const groups = {
    bully:   { cubes: [], visible: true },
    shoko:   { cubes: [], visible: true },
    friends: { cubes: [], visible: true }
}

const cubeGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
const spawnCounts = { bully: 0, shoko: 0, friends: 0 }

const drawCube = (color, type) => {
    let safeColor
    if (typeof color === 'string') {
        safeColor = new THREE.Color(color)
    } else if (color && typeof color === 'object' && 'r' in color) {
        safeColor = new THREE.Color(color.r / 255, color.g / 255, color.b / 255)
    } else {
        safeColor = new THREE.Color('#ffffff')
    }

    const mat = new THREE.MeshStandardMaterial({
        color: safeColor,
        roughness: 0.3,
        metalness: 0.3
    })

    const cube = new THREE.Mesh(cubeGeometry, mat)
    const n = spawnCounts[type]
    let px, py, pz

    if (type === 'bully') {
       
        const angle = n * 2.399963
        const radius = 3.5 + (n % 8) * 1.0
        px = Math.cos(angle) * radius + (Math.random() - 0.5) * 1.2
        pz = Math.sin(angle) * radius + (Math.random() - 0.5) * 1.2
        py = -3 - Math.random() * 3                  // Y: -3 to -6

    } else if (type === 'friends') {
     
        const podIndex = Math.floor(n / 10)
        const posInPod  = n % 10
        const podX = [-9, -1, 8][podIndex % 3]
        const podAngle  = (posInPod / 10) * Math.PI * 2
        const podRadius = 0.5 + Math.random() * 0.7
        px = podX + Math.cos(podAngle) * podRadius + (Math.random() - 0.5) * 0.3
        pz = Math.sin(podAngle) * podRadius + (Math.random() - 0.5) * 0.3
        py = 5 + Math.random() * 3        

    } else {
      
        const total = 400
        const spreadX = ((n / total) - 0.5) * 24
        px = spreadX + (Math.random() - 0.5) * 1.0
        pz = (Math.random() - 0.5) * 16          
        py = 0 + Math.random() * 2                   
    }

    cube.position.set(px, py, pz)
    cube.rotation.x = Math.random() * Math.PI * 2
    cube.rotation.y = Math.random() * Math.PI * 2
    cube.rotation.z = Math.random() * Math.PI * 2

    scene.add(cube)
    spawnCounts[type]++
    groups[type].cubes.push({
        mesh: cube,
        baseY: py,
        baseX: px,
        phase: Math.random() * Math.PI * 2,
        type
    })
}

/********
 ** UI **
 ********/
const ui = new dat.GUI()
ui.title("A Silent Voice")

const uiObj = {
    sourceText:      "",
    saveSourceText() { saveSourceText() },
    term1:   'bullying',
    colour1: '#ad2424',
    term2:   'friends',
    colour2: '#40c6f7',
    term3:   'deaf',
    colour3: '#ff6ac3',
    saveTerms() { saveTerms() }
}

const saveSourceText = () => {
    textFolder.hide()
    termsFolder.show()
    visualizeFolder.show()
    tokenizeSourceText(uiObj.sourceText)
}

const saveTerms = () => {
    // Clear all old cubes cleanly before redrawing
    for (const key of Object.keys(groups)) {
        for (const obj of groups[key].cubes) {
            scene.remove(obj.mesh)
            obj.mesh.material.dispose()
        }
        groups[key].cubes = []
        groups[key].visible = true
        spawnCounts[key] = 0
    }

    // Draw each term into its correct group key
    findAndDraw(uiObj.term1, uiObj.colour1, 'bully')
    findAndDraw(uiObj.term2, uiObj.colour2, 'friends')
    findAndDraw(uiObj.term3, uiObj.colour3, 'shoko')   // always maps to 'shoko' group

    // Reset all toggle buttons to active
    Object.keys(groups).forEach(key => {
        const btn = document.getElementById(`btn-${key}`)
        if (btn) {
            btn.classList.add('active')
            btn.classList.remove('inactive')
        }
    })

    // Close any open card and show the panel
    if (openCard) {
        storyCards[openCard].style.display = 'none'
        openCard = null
    }
    document.getElementById('presentation-panel').style.display = 'flex'
}

const textFolder = ui.addFolder("Source Text")
textFolder.add(uiObj, 'sourceText').name("Paste text here")
textFolder.add(uiObj, 'saveSourceText').name("Save Text →")

const termsFolder = ui.addFolder("Search Terms")
termsFolder.add(uiObj, 'term1').name("Term 1 (bullying)")
termsFolder.addColor(uiObj, 'colour1').name("Colour 1")
termsFolder.add(uiObj, 'term2').name("Term 2 (friends)")
termsFolder.addColor(uiObj, 'colour2').name("Colour 2")
termsFolder.add(uiObj, 'term3').name("Term 3)")
termsFolder.addColor(uiObj, 'colour3').name("Colour 3")

const visualizeFolder = ui.addFolder("Visualise")
visualizeFolder.add(uiObj, 'saveTerms').name("▶  Visualize")

termsFolder.hide()
visualizeFolder.hide()

/*********************
 ** TEXT ANALYSIS **
 *********************/
let tokenizedText = []

const tokenizeSourceText = (sourceText) => {
    const cleaned = sourceText
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()"'\n\r]/g, " ")
        .toLowerCase()
    tokenizedText = cleaned.split(/\s+/).filter(w => w.length > 0)
    console.log(`Tokenized ${tokenizedText.length} words.`)
}

const findAndDraw = (term, color, type) => {
    if (!term || !term.trim()) return
    const t = term.trim().toLowerCase()
    let count = 0

    for (let i = 0; i < tokenizedText.length; i++) {
        if (tokenizedText[i] === t) {
            count++
            for (let a = 0; a < 100; a++) {
                drawCube(color, type)
            }
        }
    }

    console.log(`"${t}" → ${count} match(es), ${count * 100} cubes into group "${type}"`)
    if (count === 0) console.warn(`"${t}" not found — try: bullying, friends, deaf, hear`)
}

/******************************
 ** PRESENTATION TOGGLE PANEL **
 ******************************/
const findings = {
    bully: {
        label: "Bullying",
        color: "#8e1921",
        say: `Shoya bullied Shoko from the start — ripping her hearing aids out, throwing them away, calling her disgusting. When the school found out, his friends blamed it all on him and walked away. Shoko left. Shoya ended up just as alone as he made her feel.<br><br>
        The red cubes are all spread far apart — bullying pushes everyone away from each other. They spin out of control and slowly shrink, because once Shoko left, everything Shoya had disappeared too.`
    },
    friends: {
        label: "Friends",
        color: "#56cfff",
        say: `By high school Shoya had X marks over every face — he couldn't see anyone as real anymore. He had a plan to end his life, but first he returned Shoko's notebook. Instead of apologizing he asked "can we be friends?" — the same thing she was asking him while he bullied her. She said yes and that saved him.<br><br>
        Small gold clusters with big empty gaps — the left cluster is his friends at the start, the huge gap is years alone, the right cluster is Shoko saying yes. They float high and bounce because that moment of connection is the only hopeful thing in the whole story.`
    },
    shoko: {
        label: "Shoko POV",
        color: "#f26e96",
        say: `Shoko is deaf and only communicated through a notebook and sign language. Even while Shoya tormented her, she never hated him — she just kept trying. Years later she forgave him the moment he came back, and that forgiveness is what kept him alive.<br><br>
        Blue cubes spread evenly everywhere with no gaps — because Shoko runs through every single part of this story from beginning to end. They slowly rise over time because no matter what happened to her, she never stopped moving forward.`
    }
}

let openCard = null
const storyCards = {}

Object.keys(findings).forEach(key => {
    const f = findings[key]

    const wrapper = document.createElement('div')
    wrapper.className = 'term-wrapper'

    const btn = document.createElement('button')
    btn.className = 'term-btn active'
    btn.id = `btn-${key}`
    btn.style.setProperty('--term-color', f.color)
    btn.innerHTML = f.label

    const card = document.createElement('div')
    card.className = 'story-card'
    card.style.borderColor = f.color
    card.style.display = 'none'
    card.innerHTML = `<p style="font-size:10px; line-height:1.75; color:#a098b0;">${f.say}</p>`

    storyCards[key] = card
    btn.addEventListener('click', () => toggleTerm(key))
    wrapper.appendChild(btn)
    wrapper.appendChild(card)
    document.getElementById('toggle-buttons').appendChild(wrapper)
})

const toggleTerm = (key) => {
    // Clicking the same button again → close card, restore all cubes
    if (openCard === key) {
        storyCards[key].style.display = 'none'
        openCard = null
        Object.keys(groups).forEach(k => {
            groups[k].visible = true
            groups[k].cubes.forEach(obj => obj.mesh.visible = true)
            const b = document.getElementById(`btn-${k}`)
            b.classList.add('active')
            b.classList.remove('inactive')
        })
        return
    }

    // Close previous card if one was open
    if (openCard) {
        storyCards[openCard].style.display = 'none'
    }

    // Open this card, isolate this group's cubes
    openCard = key
    storyCards[key].style.display = 'block'

    Object.keys(groups).forEach(k => {
        const isActive = k === key
        groups[k].visible = isActive
        groups[k].cubes.forEach(obj => obj.mesh.visible = isActive)
        const b = document.getElementById(`btn-${k}`)
        b.classList.toggle('active', isActive)
        b.classList.toggle('inactive', !isActive)
    })
}

/*******************
 ** ANIMATION LOOP **
 *******************/
const clock = new THREE.Clock()

const animation = () => {
    const t = clock.getElapsedTime()

    for (const key of Object.keys(groups)) {
        for (const obj of groups[key].cubes) {
            if (!obj.mesh.visible) continue

            if (obj.type === 'bully') {
                /*
                 * Fast chaotic spin on all axes — Shoya out of control,
                 * not realising the damage he's doing. Slowly shrinks over
                 * time as his power fades and guilt takes over. Never fully
                 * stops spinning — what he did never fully goes away.
                 */
                obj.mesh.rotation.x = t * 1.1 + obj.phase
                obj.mesh.rotation.y = t * 1.5 + obj.phase
                obj.mesh.rotation.z = t * 0.7 + obj.phase * 1.2
                const shrink = Math.max(0.25, 1.0 - t * 0.01)
                obj.mesh.scale.setScalar(shrink)

            } else if (obj.type === 'friends') {
                /*
                 * Gentle bob up and down — fragile, alive, hopeful.
                 * Slow drift on X — like Shoya and Shoko getting close,
                 * drifting apart, finding each other again.
                 */
                obj.mesh.position.y = obj.baseY + Math.sin(t * 0.9 + obj.phase) * 0.45
                obj.mesh.position.x = obj.baseX + Math.sin(t * 0.3 + obj.phase) * 0.6
                obj.mesh.rotation.y = t * 0.12 + obj.phase

            } else if (obj.type === 'shoko') {
                /*
                 * Slowly and steadily rises upward over time — Shoko rising
                 * above everything that was done to her, quietly and without
                 * stopping. Gentle breathe pulse — she never stopped going.
                 */
                obj.mesh.position.y = obj.baseY + (t * 0.012) + Math.sin(t * 1.1 + obj.phase) * 0.18
                const breathe = 0.88 + Math.sin(t * 1.6 + obj.phase) * 0.12
                obj.mesh.scale.setScalar(breathe)
            }
        }
    }

    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(animation)
}

animation()