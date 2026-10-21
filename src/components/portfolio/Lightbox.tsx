import { useEffect, useRef } from 'react'
import type { PointerEvent } from 'react'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import type { GalleryItem } from '../../wix/portfolio/types'
import { photoAlt } from '../../content/portfolio'
import { GalleryMedia } from './GalleryMedia'
import { Icon } from '../ui/Icon'

type LightboxProps = {
  items: GalleryItem[]
  index: number
  onIndex: (index: number) => void
  // X, Escape or a click beside the photo
  onClose: () => void
}

// A horizontal touch drag at least this long changes photo
const SWIPE_PX = 50

const navButton =
  'grid size-12 shrink-0 cursor-pointer place-items-center text-paper transition-colors duration-300 hover:text-rose bp-560:size-11'

export const Lightbox = ({ items, index, onIndex, onClose }: LightboxProps) => {
  const dialog = useRef<HTMLDialogElement>(null)
  const swipeStart = useRef<number | null>(null)
  const total = items.length
  const item = items[index]

  useEffect(() => {
    const d = dialog.current
    d?.showModal()
    return () => d?.close()
  }, [])

  const go = (step: number) => onIndex((index + step + total) % total)

  const onPointerDown = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') swipeStart.current = e.clientX
  }
  const onPointerUp = (e: PointerEvent) => {
    if (swipeStart.current === null) return
    const dx = e.clientX - swipeStart.current
    swipeStart.current = null
    if (Math.abs(dx) >= SWIPE_PX) go(dx < 0 ? 1 : -1)
  }

  return (
    <dialog
      ref={dialog}
      aria-label="Portfolio photos"
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') go(-1)
        else if (e.key === 'ArrowRight') go(1)
      }}
      className="m-0 h-dvh max-h-none w-screen max-w-none bg-ink/95 p-0 text-paper backdrop:bg-ink/60 open:grid open:grid-rows-[auto_1fr_auto] motion-safe:open:animate-[fade-in_0.4s_var(--ease-brand)_both]"
    >
      <header className="flex items-center justify-end px-(--gutter) pt-4">
        <button type="button" aria-label="Close" onClick={onClose} className={`${navButton} -mr-3`}>
          <Icon icon={X} size={26} />
        </button>
      </header>

      <div
        className="flex min-h-0 touch-pan-y items-center justify-center gap-[clamp(8px,2vw,32px)] px-(--gutter) bp-560:px-0"
        // A click beside the photo closes, like a click on a modal's backdrop
        onClick={(e) => e.target === e.currentTarget && onClose()}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (swipeStart.current = null)}
      >
        {total > 1 && (
          <button type="button" aria-label="Previous photo" onClick={() => go(-1)} className={`${navButton} bp-560:hidden`}>
            <Icon icon={ArrowLeft} size={26} />
          </button>
        )}
        <figure className="m-0 flex size-full min-h-0 min-w-0 items-center justify-center">
          <GalleryMedia
            key={item.id}
            item={{ ...item, title: photoAlt(index, total) }}
            className="max-h-full max-w-full object-contain select-none motion-safe:animate-[fade-in_0.4s_var(--ease-brand)_both]"
          />
        </figure>
        {total > 1 && (
          <button type="button" aria-label="Next photo" onClick={() => go(1)} className={`${navButton} bp-560:hidden`}>
            <Icon icon={ArrowRight} size={26} />
          </button>
        )}
      </div>

      <footer className="flex items-center justify-center gap-6 px-(--gutter) py-4">
        {total > 1 && (
          <button type="button" aria-label="Previous photo" onClick={() => go(-1)} className={`${navButton} hidden bp-560:grid`}>
            <Icon icon={ArrowLeft} size={22} />
          </button>
        )}
        <p className="text-t-sm tracking-[0.2em] text-stone-light tabular-nums" aria-live="polite">
          {index + 1} / {total}
        </p>
        {total > 1 && (
          <button type="button" aria-label="Next photo" onClick={() => go(1)} className={`${navButton} hidden bp-560:grid`}>
            <Icon icon={ArrowRight} size={22} />
          </button>
        )}
      </footer>
    </dialog>
  )
}
