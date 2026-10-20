import type { UseBookingFlow } from '../../hooks/bookings/useBookingFlow'

// The chosen add-ons as objects (name, price) in the owner's group order
export const selectedAddOns = (flow: Pick<UseBookingFlow, 'addOnGroups' | 'addOns'>) =>
  flow.addOnGroups.flatMap((g) => g.addOns.filter((a) => flow.addOns[a.id] > 0))
