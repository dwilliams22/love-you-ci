import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderRoute } from '../test/renderRoute'
import type { UseProjectDetail } from '../hooks/portfolio/useProjectDetail'
import type { GalleryItem, ProjectDetail } from '../wix/portfolio/types'
import { originRatio, toGalleryItem } from '../wix/portfolio/portfolio-core'

const photo = (n: number): GalleryItem => ({
  id: `p${n}`,
  kind: 'image',
  title: `Facetune_${n}`,
  description: '',
  imageUrl: `https://static.wixstatic.com/media/f${n}~mv2.jpg/v1/fill/w_1600,h_2133,al_c/f${n}~mv2.jpg`,
  videoUrl: null,
  linkUrl: null,
  linkTarget: null,
})

const project = { id: 'proj', slug: 'contemporary-homes', title: 'My Portfolio', description: 'Soft and seamless glam.' } as ProjectDetail

const mocks = vi.hoisted(() => ({ state: {} as UseProjectDetail }))
vi.mock('../hooks/portfolio/useProjectDetail', () => ({ useProjectDetail: () => mocks.state }))

const withPhotos = (count: number) => {
  mocks.state = { project, notFound: false, items: Array.from({ length: count }, (_, i) => photo(i + 1)), error: null }
}

beforeEach(() => withPhotos(9))

describe('portfolio page', () => {
  it('shows the heading, the Wix intro and every photo', () => {
    renderRoute('/portfolio')
    expect(screen.getByRole('heading', { level: 1, name: 'Portfolio' })).toBeInTheDocument()
    expect(screen.getByText('Soft and seamless glam.')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /^Makeup by Ci, photo \d+ of 9$/ })).toHaveLength(9)  })

  it('makes photos 1 and 4 of every 6 large and centers the leftovers in their own row', () => {
    renderRoute('/portfolio')
    const [mosaic, leftovers] = within(screen.getByRole('main')).getAllByRole('list')
    const tiles = within(mosaic).getAllByRole('listitem')
    expect(tiles).toHaveLength(6)
    expect(tiles.map((t) => t.classList.contains('col-span-2'))).toEqual([true, false, false, true, false, false])
    expect(within(leftovers).getAllByRole('listitem')).toHaveLength(3)
  })

  it('opens the lightbox, steps with the arrows and keys, wraps, and closes back to the tile', async () => {
    renderRoute('/portfolio')
    await userEvent.click(screen.getByRole('button', { name: 'Makeup by Ci, photo 2 of 9' }))
    const dialog = screen.getByRole('dialog', { name: 'Portfolio photos' })
    expect(within(dialog).getByText('2 / 9')).toBeInTheDocument()
    expect(within(dialog).getByRole('img')).toHaveAttribute('alt', 'Makeup by Ci, photo 2 of 9')

    await userEvent.click(within(dialog).getAllByRole('button', { name: 'Next photo' })[0])
    expect(within(dialog).getByText('3 / 9')).toBeInTheDocument()
    await userEvent.keyboard('{ArrowLeft}{ArrowLeft}{ArrowLeft}')
    expect(within(dialog).getByText('9 / 9')).toBeInTheDocument()

    await userEvent.click(within(dialog).getByRole('button', { name: 'Close' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Makeup by Ci, photo 9 of 9' })).toHaveFocus()
  })

  it('shows skeletons while loading', () => {
    mocks.state = { project: null, notFound: false, items: null, error: null }
    renderRoute('/portfolio')
    expect(screen.getByRole('list', { name: 'Loading photos' })).toBeInTheDocument()
  })

  it('offers a retry when the portfolio fails to load', () => {
    mocks.state = { project: null, notFound: false, items: [], error: 'boom' }
    renderRoute('/portfolio')
    expect(screen.getByRole('alert')).toHaveTextContent('We couldn’t load the portfolio right now.')
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument()
  })
})

describe('portfolio gallery items', () => {
  const imgSrc = (_: unknown, w: number, h: number) => `img-${w}x${h}`
  const videoSrc = () => null

  it('reads the photo size from either transport', () => {
    expect(originRatio('wix:image://v1/a~mv2.jpg/a~mv2.jpg#originWidth=1284&originHeight=1871')).toBeCloseTo(1871 / 1284)
    expect(originRatio({ width: 1000, height: 1500 })).toBe(1.5)
    expect(originRatio('wix:image://v1/a~mv2.jpg/a~mv2.jpg')).toBeNull()
  })

  it('scales a photo at its own aspect so portraits are not cropped to landscape', () => {
    const raw = { type: 'IMAGE', image: { imageInfo: 'wix:image://v1/a~mv2.jpg/a~mv2.jpg#originWidth=1200&originHeight=1800' } }
    expect(toGalleryItem(raw, imgSrc, videoSrc)?.imageUrl).toBe('img-1600x2400')
  })
})
