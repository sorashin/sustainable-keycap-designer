import React, { useEffect, createRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// import { gsap } from 'gsap'
// import { Color } from 'three'


const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const newScene = () => {
  const scene = new THREE.Scene()
  return scene
}

const newCamera = () => {
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.x = 100
  camera.position.y = 100
  camera.position.z = 400
  return camera
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

    // mesh
    const geometry = new THREE.BoxGeometry(50, 50, 50)
    const material = new THREE.MeshNormalMaterial()
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

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