import React, { useEffect, createRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// import { gsap } from 'gsap'
// import { Color } from 'three'

// Debug
const debugObject = {}
//Model Loader
const gltfLoader = new GLTFLoader()

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

/**
 * Models
 */
let currentKey = null
let previousKey = null
const keys =[
    {
        model:null,
        title:'SwitchBlue',
        description:'Switchコントローラーの青色の廃材を破砕して作成しました',
        imgUrl:'/images/colors/00.jpg'
    },
    {
        model:null,
        title:'消えいろピットブルー',
        description:'スティックのり’消えいろピット’の廃材を使用した青色キーです',
        imgUrl:'/images/colors/01.jpg'
    },
    {
        model:null,
        title:'ソフトバンクルーターアイボリー',
        description:'ソフトバンクのルーターの廃棄品の筐体を破砕して作成したアイボリーのキーです',
        imgUrl:'/images/colors/02.jpg'
    },
    {
        model:null,
        title:'消えいろピットブルー',
        description:'スティックのり’消えいろピット’の廃材を使用した青色キーです',
        imgUrl:'/images/colors/03.jpg'
    },
]

const newScene = () => {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color('#cccccc')
  return scene
}

const newCamera = () => {
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
    camera.position.set(4, 1, - 4)
    return camera
}

/**
 * Update all materials
 */
const updateAllMaterials = (scene) =>
{
    scene.traverse((child) =>
    {
        if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial){
            child.material.envMapIntensity = debugObject.envMapIntensity
            child.material.needsUpdate = true
            child.castShadow = true
            child.receiveShadow = true
        }
    })
}

const newLight = () => {
    const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
    directionalLight.castShadow = true
    directionalLight.shadow.camera.far = 15
    directionalLight.shadow.mapSize.set(1024, 1024)
    directionalLight.shadow.normalBias = 0.05
    directionalLight.position.set(0.25, 3, - 2.25)
    return directionalLight
}

const newRenderer = (mount) => {
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.autoClear = true
  if (mount.current) {
    mount.current.appendChild(renderer.domElement)
  }
  return renderer
}

const BaseScene = () => {
  const mount = createRef()
  useEffect(() => {
    
    
    
    // scene
    const scene = newScene()
    

    // camera
    const camera = newCamera()

    // renderer
    const renderer = newRenderer(mount)

    //AxisHelper
    const axesHelper = new THREE.AxesHelper( 5 );
    scene.add( axesHelper );

    //Light
    const light = newLight()
    scene.add(light)

    for (const index in keys){
        gltfLoader.load(
            `/models/keys/glTF/key_${index}.gltf`,
            (gltf) =>
            {   
                keys[index].model = gltf.scene
                keys[index].model.children[2].name = `${index}`
                keys[index].model.scale.set(1, 1, 1)
                keys[index].model.position.set(0,0,index*3)
                keys[index].model.rotation.y = Math.PI * 0.5
                console.log(keys[index].model)
                scene.add(keys[index].model)
                updateAllMaterials(scene)
            }
        )
    }


    //Screen Resize
    window.addEventListener('resize', () =>
    {
        // Update sizes
        sizes.width = window.innerWidth
        sizes.height = window.innerHeight

        // Update camera
        camera.aspect = sizes.width / sizes.height
        camera.updateProjectionMatrix()

        // Update renderer
        renderer.setSize(sizes.width, sizes.height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    
    // render
    const render = () => {
      renderer.render(scene, camera)
    }
    //Clock
    const clock = new THREE.Clock()

    // animation
    const tick = () => {
        // Clock
        const elapsedTime = clock.getElapsedTime()
        // Update controls
        controls.update()
        // Call tick again on the next frame
        requestAnimationFrame(tick)
        // Render
        render()
    }
    tick()
  }, [mount])
  return (
    <>
      <div ref={mount} />
    </>
  )
}
export default BaseScene