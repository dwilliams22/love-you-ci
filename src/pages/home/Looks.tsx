import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Icon } from '../../components/ui/Icon'
import { PhotoSlot } from '../../components/ui/PhotoSlot'
import { useCarousel } from '../../hooks/useCarousel'

// REPLACE: each look photo, 4:5 (e.g. 1000x1250)
const looks = ['Look 1', 'Look 2', 'Look 3', 'Look 4', 'Look 5', 'Look 6', 'Look 7']

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
        {looks.map((label) => (
          <li key={label} className="look taped tape-rose aspect-[4/5] snap-start">
            <PhotoSlot label={label} className="h-full" />
          </li>
        ))}
      </ul>
    </section>
  )
}
