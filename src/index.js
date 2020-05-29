/* global IntersectionObserver */

import lottie from 'lottie-web'
import Rellax from 'rellax'
import './styles/styles.scss'
import './logoEmitter'
import './utils/screenSize'
import initState from './utils/state'
import initChest from './chest'
import initTransitions from './transitions'

let chest = null
let transitions = {}

initState({
  scene: 'loading' // default is 'loading'
})

loadChest(loaded)

function loaded () {
  transitions = initTransitions(chest)
  if (window.state.scene === 'loading') {
    window.scrollTo(0, 0)
    transitions.intro()
  } else {
    document.querySelector('.loading').style.opacity = 0
    transitions[window.state.scene](true)
  }
  initChestObserver()
  loadLogoAnimation()
  Rellax('.rellax', {
    center: true
  })
}

function chestClickHandler () {
  switch (window.state.scene) {
    case 'intro':
      transitions.ecobee()
      break
    case 'ecobee':
      transitions.audi()
      break
  }
}

function initChestObserver () {
  const observer = new IntersectionObserver((e) => {
    e.forEach(item => {
      if (item.isIntersecting) {
        if (chest && chest.canvas) {
          const section = item.target.dataset.section
          if (section === 'footer') {
            window.setTimeout(() => {
              lottie.play()
            }, 500)
          } else {
            item.target.appendChild(chest.canvas)
            if (window.state.scene === 'ecobee') {
              if (section === 'ecobee') {
                chest.gotoAndStop('ecobee', true)
              } else if (section === 'audi') {
                chest.gotoAndStop('audi')
              }
            }
          }
        }
      }
    })
  })
  observer.observe(document.querySelector('.ecobee .hero-chest'))
  observer.observe(document.querySelector('.audi .hero-chest'))
  observer.observe(document.querySelector('.worldvision .hero-chest'))
  observer.observe(document.querySelector('.contact .hero-chest'))
  observer.observe(document.querySelector('.footer-logo'))
}

function loadChest (cb) {
  initChest({
    file: 'assets/chest.glb',
    container: document.querySelector('.ecobee .hero-chest'),
    onClick: chestClickHandler
  }, (err, data) => {
    if (err) {
      console.log(err)
    } else {
      chest = data
      cb()
    }
  })
}

function loadLogoAnimation () {
  lottie.loadAnimation({
    container: document.querySelector('.footer-logo'),
    renderer: 'svg',
    loop: false,
    autoplay: false,
    path: '/assets/logos/appleby.json'
  })
}
