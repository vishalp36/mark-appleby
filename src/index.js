/* global window requestAnimationFrame */

import * as THREE from 'three'
import * as CANNON from 'cannon'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import objects from './objects'
import lights from './lights'

// Three.js shared variables
var camera, scene, renderer, controls

// Cannon.js shared variables
var physicsSimulation

// Init Physics Simulation
function initCannon () {
  const GRAVITY = -9.82
  physicsSimulation = new CANNON.World()
  physicsSimulation.gravity.set(0, GRAVITY, 0)
}

function initThree () {
  // Create Renderer
  renderer = new THREE.WebGLRenderer()
  renderer.shadowMap.enabled = true
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)

  // Create Scene
  scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0xFFFFFF, 0.1)

  // Create Camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.y = 1.5
  camera.position.z = 3
  scene.add(camera)

  // Add Orbit Controls
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.1
  controls.minDistance = 2
  controls.maxDistance = 5

  // Add Lights
  lights.forEach(light => scene.add(light))

  // Add Objects
  objects.forEach(object => {
    scene.add(object)
    if (object.physics) {
      physicsSimulation.addBody(object.physics)
    }
  })
}

// Handle Window Resize
window.addEventListener('resize', onWindowResize, false)
function onWindowResize () {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

// Animate
function animate () {
  controls.update()
  updatePhysics()
  render()
  requestAnimationFrame(animate)
}

// Update Physics
const TIME_STEP = 1 / 60
function updatePhysics () {
  physicsSimulation.step(TIME_STEP)
  objects.forEach(object => {
    if (object.physics && object.physics.mass) {
      object.position.copy(object.physics.position)
      object.quaternion.copy(object.physics.quaternion)
    }
  })
}

// Render
function render () {
  renderer.render(scene, camera)
}

initCannon()
initThree()
animate()
