
  import * as THREE from 'three'
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
  import { gsap } from 'gsap'

const threeJs = () => {
  
  /**
   * Loaders
   */
  let sceneReady = false
  const loadingBarElement = document.querySelector('.loading-bar')
  const loadingManager = new THREE.LoadingManager(
      // Loaded
      () =>
      {
          // Wait a little
          /* eslint no-unused-expressions: "off" */
          window.setTimeout(() =>
          {
              // Animate overlay
              gsap.to(overlayMaterial.uniforms.uAlpha, { duration: 3, value: 0, delay: 1 })
  
              // Update loadingBarElement
              loadingBarElement.classList.add('ended')
              loadingBarElement.style.transform = ''
          }, 500),
          window.setTimeout(() =>
          {
              sceneReady = true
          }, 2000)
      },
  
      // Progress
      (itemUrl, itemsLoaded, itemsTotal) =>
      {
          // Calculate the progress and update the loadingBarElement
          const progressRatio = itemsLoaded / itemsTotal
          loadingBarElement.style.transform = `scaleX(${progressRatio})`
      }
  )
  const gltfLoader = new GLTFLoader(loadingManager)
  // const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager)
  
  /**
   * Base
   */
  // Debug
  const debugObject = {}
  
  // Canvas
  const canvas = document.querySelector('canvas.webgl')
  
  // Scene
  const scene = new THREE.Scene()
  
  /**
   * Overlay
   */
  const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1)
  const overlayMaterial = new THREE.ShaderMaterial({
      // wireframe: true,
      transparent: true,
      uniforms:
      {
          uAlpha: { value: 1 }
      },
      vertexShader: `
          void main()
          {
              gl_Position = vec4(position, 1.0);
          }
      `,
      fragmentShader: `
          uniform float uAlpha;
          void main()
          {
              gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
          }
      `
  })
  const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial)
  scene.add(overlay)
  
  /**
   * Update all materials
   */
  const updateAllMaterials = () =>
  {
      scene.traverse((child) =>
      {
          if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
          {
              // child.material.envMap = environmentMap
              child.material.envMapIntensity = debugObject.envMapIntensity
              child.material.needsUpdate = true
              child.castShadow = true
              child.receiveShadow = true
              // model = child
              // console.log(model.position)
          }
      })
  }
  
  scene.background = new THREE.Color('#cccccc')
  
  
  debugObject.envMapIntensity = 5
  
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
  
  for (const index in keys){
      gltfLoader.load(
          `../models/Key/glTF/key_${index}.gltf`,
          (gltf) =>
          {   
              keys[index].model = gltf.scene
              keys[index].model.children[2].name = `${index}`
              keys[index].model.scale.set(1, 1, 1)
              keys[index].model.position.set(0,0,index*3)
              keys[index].model.rotation.y = Math.PI * 0.5
              console.log(keys[index].model)
              scene.add(keys[index].model)
              updateAllMaterials()
          }
      )
  }
  
  const updateText = ()=>{
      document.querySelector('.title').textContent = `${keys[currentKey].title}`
      document.querySelector('.description').textContent = `${keys[currentKey].description}`
      document.querySelector('.thumbnail').style.backgroundImage = `url(${keys[currentKey].imgUrl})`
  }
  const highlightSelected = ()=>{
      if(previousKey!=null && currentKey!=null){
          keys[currentKey].model.scale.set(1.1,1.1,1.1)
          keys[previousKey].model.scale.set(1,1,1)
      }
      
      // console.log(keys[currentKey].model.children[2].material)
  }
  // currentKey.onChange = updateText
  
  
  /**
   * Lights
   */
  const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
  directionalLight.castShadow = true
  directionalLight.shadow.camera.far = 15
  directionalLight.shadow.mapSize.set(1024, 1024)
  directionalLight.shadow.normalBias = 0.05
  directionalLight.position.set(0.25, 3, - 2.25)
  scene.add(directionalLight)
  
  
  
  /**
   * Raycaster
   */
  const raycaster = new THREE.Raycaster()
  let currentIntersect = null
  
  /**
   * Sizes
   */
  const sizes = {
      width: window.innerWidth,
      height: window.innerHeight
  }
  
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
  
  /**
   * Mouse
   */
  const mouse = new THREE.Vector2()
  
  window.addEventListener('mousemove', (event) =>
  {
      mouse.x = event.clientX / sizes.width * 2 - 1
      mouse.y = - (event.clientY / sizes.height) * 2 + 1
      
  })
  
  window.addEventListener('click', () =>
  {
      // if(currentIntersect)
      // {
      //     switch(currentIntersect.object)
      //     {
      //         case model:
      //             console.log('click on model')
      //             break
  
      //         case model2:
      //             console.log('click on model2')
      //             break
      //     }
      // }
  })
  
  /**
   * Camera
   */
  // Base camera
  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
  camera.position.set(4, 1, - 4)
  scene.add(camera)
  
  // Controls
  const controls = new OrbitControls(camera, canvas)
  controls.enableDamping = true
  
  /**
   * Renderer
   */
  const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true
  })
  renderer.physicallyCorrectLights = true
  renderer.outputEncoding = THREE.sRGBEncoding
  renderer.toneMapping = THREE.ReinhardToneMapping
  renderer.toneMappingExposure = 3
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  
  //Clock
  const clock = new THREE.Clock()
  
  /**
   * Animate
   */
  const tick = () =>
  {   
      // Clock
      // const elapsedTime = clock.getElapsedTime()
  
      //Update Key Position
      // if (model) model.position.y = Math.sin(elapsedTime * 2)
      if(sceneReady){
          // Cast a ray from the mouse and handle events
          raycaster.setFromCamera(mouse, camera)
          
          const intersects = raycaster.intersectObjects(scene.children,true)
          if (intersects.length){
              
              if(currentKey !== intersects[0].object.name){
                  currentKey=intersects[0].object.name
                  
                  updateText()
                  highlightSelected()
                  console.log(currentKey, previousKey)
              }
              previousKey = currentKey
              
      
          }
      }
      
      // if(intersects.length)
      // {
      //     if(!currentIntersect)
      //     {
      //         console.log('mouse enter')
      //     }
  
      //     currentIntersect = intersects[0]
      // }
      // else
      // {
      //     if(currentIntersect)
      //     {
      //         console.log('mouse leave')
      //     }
          
      //     currentIntersect = null
      // }
  
  
      // Update controls
      controls.update()
  
      // Render
      renderer.render(scene, camera)
  
      // Call tick again on the next frame
      window.requestAnimationFrame(tick)
  }
  
  tick()
    
  };
  export default threeJs;