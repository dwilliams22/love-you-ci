// Portfolio page text. The intro and the photos live in Wix (Portfolio project "My Portfolio"):
// Ci edits the description, adds, removes and reorders photos in her dashboard.

// Wix kept this slug from the project's starter template; it never shows on the site.
export const PORTFOLIO_PROJECT_SLUG = 'contemporary-homes'

export const portfolioHeading = 'Portfolio'

// Ci's photo titles are file names, so every photo gets the same plain description
export const photoAlt = (index: number, total: number) => `Makeup by Ci, photo ${index + 1} of ${total}`
