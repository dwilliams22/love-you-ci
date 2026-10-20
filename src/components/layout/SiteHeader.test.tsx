import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderRoute } from '../../test/renderRoute'

const nav = () => screen.getByRole('navigation', { name: 'Main', hidden: true })

describe('SiteHeader mobile menu', () => {
  it('toggles open state and button labels', async () => {
    renderRoute('/')
    const btn = screen.getByRole('button', { name: 'Open menu' })
    expect(btn).toHaveAttribute('aria-expanded', 'false')

    await userEvent.click(btn)
    expect(nav()).toHaveClass('open')
    expect(btn).toHaveAttribute('aria-expanded', 'true')
    expect(btn).toHaveAccessibleName('Close menu')

    await userEvent.click(btn)
    expect(nav()).not.toHaveClass('open')
  })

  it('closes on Escape and returns focus to the button', async () => {
    renderRoute('/')
    const btn = screen.getByRole('button', { name: 'Open menu' })
    await userEvent.click(btn)
    await userEvent.keyboard('{Escape}')
    expect(nav()).not.toHaveClass('open')
    expect(btn).toHaveFocus()
  })

  it('closes when a link is clicked and navigates', async () => {
    const { router } = renderRoute('/')
    await userEvent.click(screen.getByRole('button', { name: 'Open menu' }))
    await userEvent.click(screen.getAllByRole('link', { name: 'Portfolio' })[0])
    expect(nav()).not.toHaveClass('open')
    expect(router.state.location.pathname).toBe('/portfolio')
  })

  it('marks the current page link', () => {
    renderRoute('/book')
    const link = screen.getAllByRole('link', { name: 'Book Appointment' })[0]
    expect(link).toHaveAttribute('aria-current', 'page')
  })
})
