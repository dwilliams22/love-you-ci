import { useOutletContext } from 'react-router'
import type { UseBookingFlow } from '../../hooks/bookings/useBookingFlow'
import type { ServiceDetail } from '../../wix/bookings/types'

export type BookingContext = {
  service: ServiceDetail
  flow: UseBookingFlow
}

// Child routes (calendar, details) read the shared booking flow from the service layout
export const useBooking = () => useOutletContext<BookingContext>()
