import { screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderRoute } from './test/renderRoute'

const pages = [
  ['/about', 'About Ci', 'About Ci'],
  ['/portfolio', 'Portfolio', 'Portfolio'],
  ['/contact', 'Contact Ci', 'Want to chat?'],
  ['/shop', 'Shop Our Products', 'Shop Our Products'],
]

describe('routes', () => {
  it('renders the landing page with its title', async () => {
    renderRoute('/')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('LOVE YOU, CIMAKEUP ARTISTRY')
    await waitFor(() => expect(document.title).toBe('Love You, Ci | Makeup Artistry'))
  })

  it.each(pages)('renders %s with heading and title', async (path, title, heading) => {
    renderRoute(path)
    expect(screen.getByRole('heading', { level: 1, name: heading })).toBeInTheDocument()
    await waitFor(() => expect(document.title).toBe(`${title} | Love You, Ci`))
  })

  it('redirects unknown URLs home', async () => {
    const { router } = renderRoute('/nope')
    await waitFor(() => expect(router.state.location.pathname).toBe('/'))
  })

  it('shows the current year in the footer', () => {
    renderRoute('/')
    expect(screen.getByText(String(new Date().getFullYear()))).toBeInTheDocument()
  })
})
