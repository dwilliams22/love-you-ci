import { services } from '@wix/bookings'
import { productsV3 } from '@wix/stores'
import { wixModule } from '../wix/sdk'

// All Wix calls share the one auth seam in src/wix/sdk.ts (visitor tokens persisted in localStorage)

// Dev-only check that the client ID works and both apps respond
export const wixSmokeTest = async () => {
  const [{ services: serviceList = [] }, { products = [] }] = await Promise.all([
    wixModule(services).queryServices({ paging: { limit: 100 } }),
    wixModule(productsV3).queryProducts({ cursorPaging: { limit: 100 } }),
  ])
  console.info(`[wix] connected: ${serviceList.length} booking services, ${products.length} products`)
}
