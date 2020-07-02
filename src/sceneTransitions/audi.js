import gsap from 'gsap'
import scrollTo from '../utils/scrollTo'
import { show, hide } from '../utils/showHide'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

function audi (chest) {
  return () => {
    scrollTo(document.body.scrollHeight, () => {
      window.setTimeout(() => {
        hide('.ecobee .hero')
        hide('.ecobee .section-content')
        show('.audi .section-content')
        show('.worldvision .hero')
        ScrollTrigger.refresh(true)
      }, 2000)
      chest.gotoAndPlay('audi')
      var tl = gsap.timeline()
      tl.to('.audi .hero-white', {
        opacity: 0,
        duration: 2,
        ease: 'power1.easeOut'
      }, 0.5)
      tl.to('.audi .hero-title', {
        opacity: 1,
        duration: 3,
        ease: 'power1.easeOut'
      }, 2)
      tl.play()
      window.state.set('scene', 'audi')
    })
  }
}

export default audi
