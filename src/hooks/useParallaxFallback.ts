import { useEffect } from 'react'
import { useLocation } from 'react-router'

// Parallax fallback for browsers without scroll-driven animations.
// Runs a rAF loop only while a parallax element is on screen.
export const useParallaxFallback = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || CSS.supports('animation-timeline: view()')) return

    const els = [...document.querySelectorAll<HTMLElement>('[data-parallax]')]
    const visible = new Set<HTMLElement>()
    let raf = 0
    const tick = () => {
      const vh = innerHeight
      visible.forEach((el) => {
        const r = el.getBoundingClientRect()
        const p = ((r.top + r.height / 2) / (vh + r.height)) * -2 + 1 // -1 entering bottom, 1 leaving top
        el.style.setProperty('--p', Math.max(-1, Math.min(1, p)).toFixed(4))
      })
      raf = visible.size ? requestAnimationFrame(tick) : 0
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) =>
        en.isIntersecting
          ? visible.add(en.target as HTMLElement)
          : visible.delete(en.target as HTMLElement),
      )
      if (visible.size && !raf) raf = requestAnimationFrame(tick)
    })
    els.forEach((el) => io.observe(el))

    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [pathname])
}
