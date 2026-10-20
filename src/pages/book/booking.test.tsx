import { screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderRoute } from '../../test/renderRoute'
import type { ServiceDetail } from '../../wix/bookings/types'

const service = {
  id: 's1',
  slug: 'soft-glam',
  name: 'Soft Glam',
  tagLine: 'Soft eyeshadow',
  type: 'APPOINTMENT',
  price: '$125',
  priceFrom: false,
  durationLabel: '1 hr 15 min',
  deposit: { amount: '$42', fullUpfrontAllowed: false },
  imageUrl: '',
  offeredDays: [],
  description: '',
  hasAddOns: false,
} as unknown as ServiceDetail

const mocks = vi.hoisted(() => ({
  fetchServiceBySlug: vi.fn(),
  flow: {} as Record<string, unknown>,
}))

vi.mock('../../wix/bookings/services', () => ({ fetchServiceBySlug: mocks.fetchServiceBySlug }))
vi.mock('../../hooks/bookings/useServices', () => ({
  useServices: () => ({ services: [service], hasMore: false, loadingMore: false, loadMore: vi.fn(), error: null }),
}))
vi.mock('../../hooks/bookings/useBookingFlow', () => ({ useBookingFlow: () => mocks.flow }))

const baseFlow = {
  days: [],
  month: new Date(),
  nextAvailable: [],
  selectedSlot: null,
  timeZoneLabel: 'Eastern Time (EDT)',
  formFields: [],
  values: {},
  ctaState: 'book',
  canBook: false,
  booking: false,
  confirmed: null,
  error: null,
  payDeposit: true,
  addOnGroups: [],
  addOnGroupsLoaded: true,
  addOns: {},
  addOnsMinutes: 0,
  setAddOnIds: vi.fn(),
  setSelectedSlot: vi.fn(),
  nextMonth: vi.fn(),
  prevMonth: vi.fn(),
  jumpTo: vi.fn(),
  setValue: vi.fn(),
  book: vi.fn(),
}

describe('booking flow', () => {
  beforeEach(() => {
    mocks.flow = { ...baseFlow }
    mocks.fetchServiceBySlug.mockResolvedValue(service)
  })

  it('lists services with price and deposit', async () => {
    renderRoute('/book')
    expect(screen.getByRole('heading', { level: 1, name: 'Choose your look' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Soft Glam' })).toHaveAttribute('href', '/book/soft-glam')
    expect(screen.getByText(/1 hr 15 min · \$125/)).toBeInTheDocument()
    await waitFor(() => expect(document.title).toBe('Book Appointment | Love You, Ci'))
  })

  it('shows the service header and a disabled Continue until a time is picked', async () => {
    renderRoute('/book/soft-glam')
    expect(await screen.findByRole('heading', { level: 1, name: 'Soft Glam' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Continue/ })).toBeDisabled()
    expect(screen.getByText('Shared upon approval')).toBeInTheDocument()
  })

  it('shows a not-found state for an unknown service', async () => {
    mocks.fetchServiceBySlug.mockResolvedValue(null)
    renderRoute('/book/nope')
    expect(await screen.findByRole('heading', { level: 1, name: 'Service not found' })).toBeInTheDocument()
  })

  it('sends the details step back to the calendar when no time is picked', async () => {
    const { router } = renderRoute('/book/soft-glam/details')
    await waitFor(() => expect(router.state.location.pathname).toBe('/book/soft-glam'))
  })

  it('labels the book button with the deposit', async () => {
    mocks.flow = {
      ...baseFlow,
      selectedSlot: { key: 'k', dayKey: '2026-10-29', label: '10:00 AM', startLocal: '2026-10-29T10:00:00', bookable: true },
      formFields: [{ target: 'email', label: 'Email', type: 'EMAIL', required: true }],
    }
    renderRoute('/book/soft-glam/details')
    expect(await screen.findByRole('button', { name: /Book · \$42 deposit/ })).toBeDisabled()
    expect(screen.getByLabelText(/Email/)).toHaveAttribute('type', 'email')
  })
})
