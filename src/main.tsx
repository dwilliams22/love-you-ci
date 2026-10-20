import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router/dom'
import './index.css'
import { router } from './router'

if (import.meta.env.DEV && import.meta.env.VITE_WIX_CLIENT_ID) {
  import('./lib/wix').then(({ wixSmokeTest }) =>
    wixSmokeTest().catch((err) => console.error('[wix] smoke test failed', err)),
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
