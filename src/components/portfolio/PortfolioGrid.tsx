import { imgAttrs } from '../../wix/media'
import type { GalleryItem } from '../../wix/portfolio/types'
import { photoAlt } from '../../content/portfolio'
import { photoId } from './photoId'

// The mockup's rhythm: in every run of 6, photos 1 and 4 are large (2×2) and the rest small.
// With dense flow on 4 columns that gives large | small small, then small small | large.
const GROUP = 6
const isLarge = (i: number) => i % GROUP === 0 || i % GROUP === 3

// Rows are sized from the container width so every tile, large or small, is exactly 3:4
const grid =
  'grid grid-flow-row-dense grid-cols-4 gap-(--gap) auto-rows-[calc((100cqw_-_3*var(--gap))/3)] bp-860:grid-cols-2 bp-860:auto-rows-[calc((100cqw_-_var(--gap))*2/3)]'
// A tile in the leftover row is one grid column wide
const leftoverTile = 'aspect-[3/4] w-[calc((100%_-_3*var(--gap))/4)] bp-860:w-[calc((100%_-_var(--gap))/2)]'

type TileProps = {
  item: GalleryItem
  index: number
  total: number
  large: boolean
  className?: string
  onOpen: (index: number) => void
}

const Tile = ({ item, index, total, large, className = '', onOpen }: TileProps) => (
  <li className={`${large ? 'col-span-2 row-span-2' : ''} ${className}`}>
    <button
      id={photoId(index)}
      type="button"
      aria-haspopup="dialog"
      onClick={() => onOpen(index)}
      className="group block size-full cursor-pointer overflow-hidden bg-mist"
    >
      <img
        {...imgAttrs(item.imageUrl, large ? '(max-width: 860px) 100vw, 50vw' : '(max-width: 860px) 50vw, 25vw', 4 / 3)}
        alt={photoAlt(index, total)}
        className="size-full object-cover transition-transform duration-700 ease-(--ease-brand) motion-safe:group-hover:scale-[1.03]"
      />
    </button>
  </li>
)

type PortfolioGridProps = {
  // null while loading
  items: GalleryItem[] | null
  onOpen: (index: number) => void
}

export const PortfolioGrid = ({ items, onOpen }: PortfolioGridProps) => {
  if (!items) {
    return (
      <ul className={`${grid} animate-pulse`} aria-label="Loading photos">
        {Array.from({ length: GROUP }, (_, i) => (
          <li key={i} className={`bg-mist ${isLarge(i) ? 'col-span-2 row-span-2' : ''}`} />
        ))}
      </ul>
    )
  }

  // Full runs of 6 form the mosaic; the rest sit centered below it, so the grid never has holes
  const mosaicCount = items.length - (items.length % GROUP)
  const tile = (item: GalleryItem, i: number, large: boolean, className?: string) => (
    <Tile key={item.id} item={item} index={i} total={items.length} large={large} className={className} onOpen={onOpen} />
  )

  return (
    <div className="@container [--gap:clamp(10px,1.6vw,24px)]">
      {mosaicCount > 0 && <ul className={grid}>{items.slice(0, mosaicCount).map((item, i) => tile(item, i, isLarge(i)))}</ul>}
      {mosaicCount < items.length && (
        <ul className={`flex flex-wrap justify-center gap-(--gap) ${mosaicCount ? 'mt-(--gap)' : ''}`}>
          {items.slice(mosaicCount).map((item, i) => tile(item, mosaicCount + i, false, leftoverTile))}
        </ul>
      )}
    </div>
  )
}
