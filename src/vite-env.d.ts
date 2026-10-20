/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Wix Headless OAuth client ID (Headless Settings in the Wix dashboard)
  readonly VITE_WIX_CLIENT_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
