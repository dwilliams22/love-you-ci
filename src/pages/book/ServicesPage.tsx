import { useState } from 'react'
import { useNavigate } from 'react-router'
import { AddOnsModal } from '../../components/booking/AddOnsModal'
import { ServiceCard, ServiceCardSkeleton } from '../../components/booking/ServiceCard'
import { useServices } from '../../hooks/bookings/useServices'
import { fetchAddOnGroups } from '../../wix/bookings/booking'
import type { AddOnGroup, ServiceSummary } from '../../wix/bookings/types'
import { bookingPath } from './bookingPath'

type Picking = { service: ServiceSummary; groups: AddOnGroup[] | null }

export const ServicesPage = () => {
  const { services, hasMore, loadingMore, loadMore, error } = useServices({ syncUrl: false })
  const navigate = useNavigate()
  const [picking, setPicking] = useState<Picking | null>(null)

  const openAddOns = (service: ServiceSummary) => {
    setPicking({ service, groups: null })
    fetchAddOnGroups(service.id).then((groups) =>
      setPicking((p) => (p?.service.id === service.id ? { service, groups } : p)),
    )
  }

  const continueTo = (service: ServiceSummary, addOnIds: string[]) => {
    setPicking(null)
    navigate(bookingPath(service.slug, addOnIds))
  }

  return (
    <main className="py-[clamp(64px,8vw,112px)]">
      <title>Book Appointment | Love You, Ci</title>
      <div className="wrap">
        <header className="max-w-[40rem]">
          <p className="mb-4 text-[0.75rem] font-semibold tracking-[0.42em] text-rose-deep">BOOK WITH CI</p>
          <h1 className="font-display text-t-2xl leading-none">Choose your look</h1>
          <p className="mt-6 text-t-lg leading-[1.55] text-stone">
            Pick a service to see available dates and times. A deposit secures your appointment.
          </p>
        </header>

        {error && services?.length === 0 ? (
          <p className="mt-16 text-stone" role="alert">
            We couldn&rsquo;t load services right now. Please refresh to try again.
          </p>
        ) : services?.length === 0 ? (
          <p className="mt-16 text-stone">No services are open for booking right now. Please check back soon.</p>
        ) : (
          <ul className="mt-[clamp(56px,7vw,96px)] grid grid-cols-3 gap-x-[clamp(24px,3vw,44px)] gap-y-20 bp-860:grid-cols-2 bp-560:grid-cols-1 bp-560:px-[6%]">
            {services
              ? services.map((s, i) => (
                  <ServiceCard
                    key={s.id}
                    service={s}
                    index={i}
                    onBook={s.hasAddOns ? () => openAddOns(s) : undefined}
                  />
                ))
              : Array.from({ length: 3 }, (_, i) => <ServiceCardSkeleton key={i} />)}
          </ul>
        )}

        {hasMore && (
          <div className="mt-16 text-center">
            <button type="button" className="cta cursor-pointer" onClick={loadMore} disabled={loadingMore}>
              {loadingMore ? 'Loading…' : 'Load more'}
            </button>
          </div>
        )}
      </div>

      {picking && (
        <AddOnsModal
          service={picking.service}
          groups={picking.groups}
          initialSelected={[]}
          onNext={(ids) => continueTo(picking.service, ids)}
          // Closing continues without add-ons
          onClose={() => continueTo(picking.service, [])}
        />
      )}
    </main>
  )
}
