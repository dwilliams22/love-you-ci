// ?addons= carries the add-on choice into the service page; an empty value means "none chosen",
// a missing param means the visitor hasn't been asked yet (the page opens the modal)
export const ADDONS_PARAM = 'addons'

export const bookingPath = (slug: string, addOnIds: string[]) =>
  `/book/${slug}?${new URLSearchParams({ [ADDONS_PARAM]: addOnIds.join(',') })}`

export const parseAddOnIds = (value: string | null) => (value ? value.split(',').filter(Boolean) : [])
