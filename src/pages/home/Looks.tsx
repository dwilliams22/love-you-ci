import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Icon } from '../../components/ui/Icon'
import { PhotoSlot } from '../../components/ui/PhotoSlot'
import { useCarousel } from '../../hooks/useCarousel'
import look1 from '../../assets/looks/look1.jpg'
import look2 from '../../assets/looks/look2.jpg'
import look3 from '../../assets/looks/look3.jpg'
import look4 from '../../assets/looks/look4.jpg'
import look5 from '../../assets/looks/look5.jpg'
import look6 from '../../assets/looks/look6.jpg'
import look7 from '../../assets/looks/look7.jpg'

// Client looks, all 4:5 (1000x1250)
const looks = [
  { label: 'Look 1', src: look1, alt: 'Soft glam with lilac shimmer eyeshadow, wispy lashes and a glossy nude lip' },
  { label: 'Look 2', src: look2, alt: 'Soft glam with a cut crease, rosy blush and a nude lip, sleek side-swept hair' },
  { label: 'Look 3', src: look3, alt: 'Bronzed glam with winged liner, fluffy lashes and a glossy nude lip' },
  { label: 'Look 4', src: look4, alt: 'Full glam with dramatic lashes, a glowing highlight and a glossy lip, finger-wave edges' },
  { label: 'Look 5', src: look5, alt: 'Bronzed glam with sculpted brows, warm contour and a satin nude lip' },
  { label: 'Look 6', src: look6, alt: 'Bridal glam with lifted lashes, rosy blush and a glossy brown lip' },
  { label: 'Look 7', src: look7, alt: 'Full glam with lashes, defined brows and a high-shine nude gloss' },
]

const arrowClass =
  'grid size-12 cursor-pointer px-1.5 py-px place-items-center border border-ink bg-transparent text-[1.25rem] [transition:background_0.3s_var(--ease-brand),color_0.3s_var(--ease-brand),opacity_0.3s] enabled:hover:bg-ink enabled:hover:text-paper enabled:active:scale-[0.96] disabled:cursor-default disabled:opacity-30 bp-560:size-11'

export const Looks = () => {
  const { trackRef, atStart, atEnd, scroll, onKeyDown } = useCarousel()

  return (
    <section className="overflow-clip bg-mist py-[clamp(80px,10vw,140px)]" id="looks" aria-labelledby="looks-title">
      <div className="wrap mb-[clamp(40px,5vw,64px)] flex items-end justify-between gap-6 bp-560:items-center">
        <h2 id="looks-title" className="font-display text-t-2xl leading-none font-normal tracking-[0.04em]">
          OUR LOOKS
        </h2>
        <div className="flex gap-2.5">
          <button
            type="button"
            className={arrowClass}
            aria-label="Previous looks"
            aria-controls="looks-track"
            disabled={atStart}
            onClick={() => scroll(-1)}
          >
            <Icon icon={ArrowLeft} size={20} />
          </button>
          <button
            type="button"
            className={arrowClass}
            aria-label="Next looks"
            aria-controls="looks-track"
            disabled={atEnd}
            onClick={() => scroll(1)}
          >
            <Icon icon={ArrowRight} size={20} />
          </button>
        </div>
      </div>
      <ul
        ref={trackRef}
        className="looks-track grid snap-x snap-mandatory auto-cols-[clamp(230px,24vw,310px)] grid-flow-col gap-[clamp(24px,3vw,44px)] overflow-x-auto overscroll-x-contain scroll-px-(--edge) px-(--edge) pt-[26px] pb-10 bp-560:auto-cols-[74vw]"
        id="looks-track"
        tabIndex={0}
        aria-label="Our looks, scroll sideways"
        onKeyDown={onKeyDown}
      >
        {looks.map(({ label, src, alt }) => (
          <li key={label} className="look taped tape-rose aspect-[4/5] snap-start">
            <PhotoSlot label={label} className="h-full" photo={{ src, alt, width: 1000, height: 1250 }} />
          </li>
        ))}
      </ul>
    </section>
  )
}
