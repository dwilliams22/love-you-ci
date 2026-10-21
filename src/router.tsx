import { createBrowserRouter, Navigate } from 'react-router'
import type { RouteObject } from 'react-router'
import { Layout } from './components/layout/Layout'
import { AboutPage } from './pages/AboutPage'
import { DetailsPage } from './pages/book/DetailsPage'
import { SchedulePage } from './pages/book/SchedulePage'
import { ServiceBookingLayout } from './pages/book/ServiceBookingLayout'
import { ServicesPage } from './pages/book/ServicesPage'
import { ThankYouPage } from './pages/book/ThankYouPage'
import { ContactPage } from './pages/ContactPage'
import { HomePage } from './pages/home/HomePage'
import { PortfolioPage } from './pages/PortfolioPage'
import { ProductPage } from './pages/shop/ProductPage'
import { ShopPage } from './pages/shop/ShopPage'
import { ShopThankYouPage } from './pages/shop/ShopThankYouPage'

export const routes: RouteObject[] = [
  {
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'book', element: <ServicesPage /> },
      { path: 'book/thank-you', element: <ThankYouPage /> },
      {
        path: 'book/:slug',
        element: <ServiceBookingLayout />,
        children: [
          { index: true, element: <SchedulePage /> },
          { path: 'details', element: <DetailsPage /> },
        ],
      },
      { path: 'portfolio', element: <PortfolioPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'shop', element: <ShopPage /> },
      { path: 'shop/thank-you', element: <ShopThankYouPage /> },
      { path: 'shop/:slug', element: <ProductPage /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]

export const router = createBrowserRouter(routes)
