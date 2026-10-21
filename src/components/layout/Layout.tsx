import { Outlet, ScrollRestoration } from 'react-router'
import { useParallaxFallback } from '../../hooks/useParallaxFallback'
import CartDrawer from '../storefront/CartDrawer'
import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'

export const Layout = () => {
  useParallaxFallback()

  return (
    <>
      <SiteHeader />
      <Outlet />
      <SiteFooter />
      <CartDrawer />
      <ScrollRestoration />
    </>
  )
}
