import React, { useEffect, createRef, useState} from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import KeyInfo from '../components/KeyInfo'
import Palette from '../components/Palette'
// import { gsap } from 'gsap'
// import { Color } from 'three'


// Debug
const debugObject = {}
//Model Loader
const gltfLoader = new GLTFLoader()
// Cavas Size
const sizes = {
    width: typeof window !== `undefined`? window.innerWidth:null,
    height: typeof window !== `undefined`? window.innerHeight:null
}
//Raycaster
const raycaster = new THREE.Raycaster()

//Models


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

//updateAllMaterials
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

const keysJSON = [
  {index: 0, name: 'F', color:1},
  {index: 1, name: 'G', color:1},
  {index: 2, name: 'H', color:0},
  {index: 3, name: 'J', color:1},
]

const colorJSON = [
  {index: 0, color:'#5bf2ff', title: "SwitchBlue", description:'Switchコントローラーの青色の廃材を破砕して作成しました', imgUrl:'/images/colors/00.jpg'},
  {index: 1, color:'#5bf2ff', title: "消えいろピットブルー", description:'スティックのり’消えいろピット’の廃材を使用した青色キーです', imgUrl:'/images/colors/01.jpg'},
  {index: 2, color:'#5bf2ff', title: "ソフトバンクルーターアイボリー", description:'ソフトバンクのルーターの廃棄品の筐体を破砕して作成したアイボリーのキーです', imgUrl:'/images/colors/02.jpg'},
]

const BaseScene = () => {
  const mount = createRef()
  const [key, setKey] = useState(0)
  const [selectedKey, setSelectedKey] = useState(0)
  const [open, setOpen] = useState(false)
  const selectStatus = {isOpen:open, currentKey:selectedKey }
  const [keysData, setKeysData] = useState(keysJSON)

  // const [keyData, updateColor] = useData(null)
  
  

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



    for (const index in keysJSON){
        gltfLoader.load(
            `/models/keys/glTF/key_${index}.gltf`,
            (gltf) =>
            {   
                keysJSON[index].model = gltf.scene
                keysJSON[index].model.children[2].name = `${index}`
                keysJSON[index].model.scale.set(1, 1, 1)
                keysJSON[index].model.position.set(0,0,index*3)
                keysJSON[index].model.rotation.y = Math.PI * 0.5
                console.log(keysJSON[index].model)
                scene.add(keysJSON[index].model)
                updateAllMaterials(scene)
            }
        )
    }
    //Mouse
    const mouse = new THREE.Vector2()
    let currentIntersect = null

    window.addEventListener('mousemove', (event) =>
    {
        mouse.x = event.clientX / sizes.width * 2 - 1
        mouse.y = - (event.clientY / sizes.height) * 2 + 1
        
    })

    window.addEventListener('click', () =>
    {
      const intersects = raycaster.intersectObjects(scene.children,true)
      if (intersects.length){
        setOpen(true)
        let currentKey = parseInt(intersects[0].object.name, 10)
        setSelectedKey(currentKey)
        console.log('キーの上')

        


      }else{
        setOpen(false)
        console.log('キーのハズレ')
        setSelectedKey(null)
      }
    })
      


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
    // const clock = new THREE.Clock()

    // animation
    const tick = () => {
        // Clock
        // const elapsedTime = clock.getElapsedTime()
        //Raycaster
        raycaster.setFromCamera(mouse, camera)
        
        const intersects = raycaster.intersectObjects(scene.children,true)
        if (intersects.length){
          currentIntersect = intersects[0]
          let currentKey = parseInt(intersects[0].object.name, 10)
          if(currentKey && currentKey != key){
            setKey(currentKey)
          }
        }else{
          currentIntersect = null
        }

        // Update controls
        controls.update()
        // Call tick again on the next frame
        requestAnimationFrame(tick)
        // Render
        render()
    }
    tick()
  }, [])
  return (
    <>
      <div ref={mount} />
      <div>{selectStatus.isOpen ? 'true':'false'}{selectStatus.currentKey}</div>
      <Palette colorJSON={colorJSON} keysData={keysData} isOpen={selectStatus.isOpen} currentKey={selectStatus.currentKey}/>
      <KeyInfo keyId ={key} keysData={keysData} colorJSON={colorJSON}/>
      {/* {TestCustomHook()} */}
    </>
  ) 
}
export default BaseScene