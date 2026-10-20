import { createBrowserRouter, Navigate } from 'react-router'
import type { RouteObject } from 'react-router'
import { Layout } from './components/layout/Layout'
import { AboutPage } from './pages/AboutPage'
import { BookPage } from './pages/BookPage'
import { ContactPage } from './pages/ContactPage'
import { HomePage } from './pages/home/HomePage'
import { PortfolioPage } from './pages/PortfolioPage'
import { ShopPage } from './pages/ShopPage'

export const routes: RouteObject[] = [
  {
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'book', element: <BookPage /> },
      { path: 'portfolio', element: <PortfolioPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'shop', element: <ShopPage /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]

export const router = createBrowserRouter(routes)
