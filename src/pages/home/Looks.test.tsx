import { act, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MockIntersectionObserver } from '../../test/setup'
import { renderRoute } from '../../test/renderRoute'

const CARD_STEP = 340

describe('Looks carousel', () => {
  beforeEach(() => {
    MockIntersectionObserver.instances = []
    vi.mocked(Element.prototype.scrollBy).mockClear()
    vi.spyOn(HTMLElement.prototype, 'offsetLeft', 'get').mockImplementation(function (this: HTMLElement) {
      const parent = this.parentElement
      return parent ? [...parent.children].indexOf(this) * CARD_STEP : 0
    })
  })

  it('steps one card per arrow click and arrow key', async () => {
    renderRoute('/')
    await userEvent.click(screen.getByRole('button', { name: 'Next looks' }))
    expect(Element.prototype.scrollBy).toHaveBeenLastCalledWith({ left: CARD_STEP, behavior: 'smooth' })

    screen.getByRole('list', { name: 'Our looks, scroll sideways' }).focus()
    await userEvent.keyboard('{ArrowLeft}')
    expect(Element.prototype.scrollBy).toHaveBeenLastCalledWith({ left: -CARD_STEP, behavior: 'smooth' })
  })

  it('disables arrows when an end card is fully visible', () => {
    renderRoute('/')
    const track = screen.getByRole('list', { name: 'Our looks, scroll sideways' })
    const io = MockIntersectionObserver.instances.find((o) => o.targets.includes(track.children[0]))!
    const prev = screen.getByRole('button', { name: 'Previous looks' })
    const next = screen.getByRole('button', { name: 'Next looks' })

    act(() => io.callback([{ target: track.children[0], isIntersecting: true }]))
    expect(prev).toBeDisabled()
    expect(next).toBeEnabled()

    act(() =>
      io.callback([
        { target: track.children[0], isIntersecting: false },
        { target: track.lastElementChild!, isIntersecting: true },
      ]),
    )
    expect(prev).toBeEnabled()
    expect(next).toBeDisabled()
  })
})
