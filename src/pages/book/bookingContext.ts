import { useOutletContext } from 'react-router'
import type { UseBookingFlow } from '../../hooks/bookings/useBookingFlow'
import type { ServiceDetail } from '../../wix/bookings/types'

export type BookingContext = {
  service: ServiceDetail
  flow: UseBookingFlow
  // Reopens the add-ons modal (summary "Edit")
  editAddOns: () => void
}

// Child routes (calendar, details) read the shared booking flow from the service layout
export const useBooking = () => useOutletContext<BookingContext>()
