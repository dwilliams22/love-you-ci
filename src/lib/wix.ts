import { createClient, OAuthStrategy } from '@wix/sdk'
import type { Tokens } from '@wix/sdk'
import { services } from '@wix/bookings'
import { productsV3 } from '@wix/stores'

// Visitor session tokens, persisted so carts/bookings survive reloads
const TOKENS_KEY = 'wixSession'

const loadTokens = (): Tokens | undefined => {
  try {
    const raw = localStorage.getItem(TOKENS_KEY)
    return raw ? (JSON.parse(raw) as Tokens) : undefined
  } catch {
    return undefined
  }
}

const saveTokens = (tokens: Tokens) => {
  try {
    localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens))
  } catch {
    // Storage unavailable (private mode, blocked); session lasts for this page load only
  }
}

// Stores is on Catalog V3 for this site, so use productsV3 (not products)
export const wixClient = createClient({
  modules: { services, productsV3 },
  auth: OAuthStrategy({
    clientId: import.meta.env.VITE_WIX_CLIENT_ID,
    tokens: loadTokens(),
  }),
})

// Validates, renews or creates visitor tokens, then persists them
export const ensureVisitorSession = async () => {
  const tokens = await wixClient.auth.generateVisitorTokens(loadTokens())
  saveTokens(tokens)
  return tokens
}

// Dev-only check that the client ID works and both apps respond
export const wixSmokeTest = async () => {
  await ensureVisitorSession()
  const [{ services: serviceList = [] }, { products = [] }] = await Promise.all([
    wixClient.services.queryServices({ paging: { limit: 100 } }),
    wixClient.productsV3.queryProducts({ cursorPaging: { limit: 100 } }),
  ])
  console.info(`[wix] connected: ${serviceList.length} booking services, ${products.length} products`)
}
