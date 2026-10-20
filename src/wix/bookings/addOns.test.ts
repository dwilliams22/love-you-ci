import { describe, expect, it } from 'vitest'
import { appointmentSlotsRequest, bookingRequest, nextAvailableRequest } from './booking-core'
import type { ServiceDetail, Slot } from './types'

// Love You, Ci extensions to the vendored request builders
describe('add-ons in Wix requests', () => {
  it('sends chosen add-ons as customerChoices so Wix lengthens slots', () => {
    expect(appointmentSlotsRequest('svc', { addOnIds: ['a', 'b'] }).customerChoices).toEqual({ addOnIds: ['a', 'b'] })
    expect(appointmentSlotsRequest('svc', {}).customerChoices).toBeUndefined()
    const next = nextAvailableRequest({ id: 'svc', type: 'APPOINTMENT' }, { addOnIds: ['a'] })
    expect(next.customerChoices).toEqual({ addOnIds: ['a'] })
  })

  it('books add-ons with their group, quantity only when given', () => {
    const service = { id: 'svc', type: 'APPOINTMENT', paymentOption: 'ONLINE', scheduleId: 's', deposit: null } as unknown as ServiceDetail
    const slot = { startLocal: '2026-10-29T15:25:00', endLocal: '2026-10-29T16:15:00', staff: [], location: null, scheduleId: 's', eventId: null } as unknown as Slot
    const req = bookingRequest(service, slot, {
      idKey: '_id',
      timeZone: 'America/New_York',
      addOns: [
        { id: 'bottom', groupId: 'g1' },
        { id: 'mink', groupId: 'g1', quantity: 1 },
      ],
    })
    expect(req.bookedAddOns).toEqual([
      { _id: 'bottom', groupId: 'g1' },
      { _id: 'mink', groupId: 'g1', quantity: 1 },
    ])
    expect(bookingRequest(service, slot, { timeZone: 'America/New_York' }).bookedAddOns).toBeUndefined()
  })
})
