import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'

// Arrows step one card; disabled state follows the ends via IntersectionObserver
export const useCarousel = () => {
  const trackRef = useRef<HTMLUListElement>(null)
  const [atStart, setAtStart] = useState(false)
  const [atEnd, setAtEnd] = useState(false)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const cards = track.children
    const first = cards[0]
    const last = cards[cards.length - 1]
    const ends = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (en.target === first) setAtStart(en.isIntersecting)
          if (en.target === last) setAtEnd(en.isIntersecting)
        }),
      { root: track, threshold: 0.95 },
    )
    ends.observe(first)
    ends.observe(last)
    return () => ends.disconnect()
  }, [])

  const scroll = (dir: 1 | -1) => {
    const track = trackRef.current
    if (!track) return
    const [a, b] = track.children as unknown as HTMLElement[]
    track.scrollBy({ left: (b.offsetLeft - a.offsetLeft) * dir, behavior: 'smooth' })
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault()
      scroll(e.key === 'ArrowRight' ? 1 : -1)
    }
  }

  return { trackRef, atStart, atEnd, scroll, onKeyDown }
}
