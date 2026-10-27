import { describe, expect, it } from 'vitest'
import { bookingRequest, toSlot } from './booking-core'
import type { ServiceDetail } from './types'

// Love You, Ci extensions: checkout should name Ci and "Upon Approval" like her Wix site does
describe('staff and location in Create Booking', () => {
  const service = { id: 'svc', type: 'APPOINTMENT', paymentOption: 'ONLINE', scheduleId: 's', deposit: null } as unknown as ServiceDetail
  // Shape of a live slot from List Availability Time Slots (Oct 27, 2026)
  const raw = {
    localStartDate: '2026-11-04T10:00:00',
    localEndDate: '2026-11-04T10:45:00',
    scheduleId: 's',
    location: { formattedAddress: 'Upon Approval ', locationType: 'CUSTOM' },
    availableResources: [{ resourceTypeId: 'staff', resources: [{ name: 'Ciara Williams', _id: 'ci' }] }],
  }

  it('books the only available staff member instead of any staff member', () => {
    const slot = bookingRequest(service, toSlot(raw), { idKey: '_id', timeZone: 'America/New_York' }).bookedEntity.slot
    expect(slot.resource).toEqual({ _id: 'ci', name: 'Ciara Williams' })
    expect(slot.resourceSelections).toBeUndefined()
  })

  it('keeps any staff member when more than one person can take the slot', () => {
    const two = { ...raw, availableResources: [{ resources: [{ name: 'A', _id: 'a' }, { name: 'B', _id: 'b' }] }] }
    const slot = bookingRequest(service, toSlot(two), { idKey: '_id', timeZone: 'America/New_York' }).bookedEntity.slot
    expect(slot.resource).toBeUndefined()
    expect(slot.resourceSelections[0].selectionMethod).toBe('ANY_RESOURCE')
  })

  it('books a custom location that only has an address', () => {
    const slot = bookingRequest(service, toSlot(raw), { idKey: '_id', timeZone: 'America/New_York' }).bookedEntity.slot
    expect(slot.location).toEqual({ name: 'Upon Approval', formattedAddress: 'Upon Approval ', locationType: 'OWNER_CUSTOM' })
  })
})
