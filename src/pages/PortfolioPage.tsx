import { useState } from 'react'
import { flushSync } from 'react-dom'
import { Lightbox } from '../components/portfolio/Lightbox'
import { PortfolioGrid } from '../components/portfolio/PortfolioGrid'
import { photoId } from '../components/portfolio/photoId'
import { useProjectDetail } from '../hooks/portfolio/useProjectDetail'
import { PORTFOLIO_PROJECT_SLUG, portfolioHeading } from '../content/portfolio'

const Gallery = ({ onRetry }: { onRetry: () => void }) => {
  const { project, notFound, items, error } = useProjectDetail(PORTFOLIO_PROJECT_SLUG)
  const [open, setOpen] = useState<number | null>(null)

  if (error || notFound) {
    return (
      <div className="mt-16 text-stone" role="alert">
        <p>We couldn&rsquo;t load the portfolio right now.</p>
        <button type="button" className="text-link cursor-pointer" onClick={onRetry}>
          Try again
        </button>
      </div>
    )
  }

  const close = () => {
    const last = open
    // Unmount (and so close) the modal first: the page is inert while it is open, so focus() would do nothing
    flushSync(() => setOpen(null))
    // Back to the tile of the photo that was showing, not the one first opened
    if (last !== null) document.getElementById(photoId(last))?.focus()
  }

  return (
    <>
      {project ? (
        project.description && (
          <p className="mt-6 max-w-[64ch] text-t-base leading-[1.7] text-stone">{project.description}</p>
        )
      ) : (
        <div className="mt-6 max-w-[64ch] animate-pulse" aria-hidden>
          <div className="h-4 bg-mist" />
          <div className="mt-3 h-4 w-3/4 bg-mist" />
        </div>
      )}

      <div className="mt-[clamp(40px,5vw,64px)]">
        {items?.length === 0 ? (
          <p className="text-stone">New photos are coming soon.</p>
        ) : (
          <PortfolioGrid items={items} onOpen={setOpen} />
        )}
      </div>

      {items && open !== null && <Lightbox items={items} index={open} onIndex={setOpen} onClose={close} />}
    </>
  )
}

export const PortfolioPage = () => {
  // Remounting the gallery is the retry: a fresh store fetches again
  const [attempt, setAttempt] = useState(0)

  return (
    <main className="wrap py-[clamp(64px,8vw,112px)]">
      <title>Portfolio | Love You, Ci</title>
      <h1 className="font-display text-t-2xl leading-none">{portfolioHeading}</h1>
      <Gallery key={attempt} onRetry={() => setAttempt(attempt + 1)} />
    </main>
  )
}
