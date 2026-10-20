import { useEffect, useState } from 'react'
import { Link, Outlet, useParams } from 'react-router'
import { ChevronLeft } from 'lucide-react'
import { Icon } from '../../components/ui/Icon'
import { depositLabel, metaLine } from '../../components/booking/serviceMeta'
import { useBookingFlow } from '../../hooks/bookings/useBookingFlow'
import type { BookingContext } from './bookingContext'
import { fetchServiceBySlug } from '../../wix/bookings/services'
import type { ServiceDetail } from '../../wix/bookings/types'


type ServiceState = { slug: string; service: ServiceDetail | null } | { slug: string; error: true }

export const ServiceBookingLayout = () => {
  const { slug = '' } = useParams()
  const [state, setState] = useState<ServiceState | null>(null)

  useEffect(() => {
    let live = true
    fetchServiceBySlug(slug)
      .then((service) => live && setState({ slug, service }))
      .catch(() => live && setState({ slug, error: true }))
    return () => {
      live = false
    }
  }, [slug])

  const current = state?.slug === slug ? state : null

  return (
    <main className="pt-[clamp(32px,4vw,56px)] pb-[clamp(80px,10vw,140px)]">
      <div className="wrap">
        <Link to="/book" className="inline-flex items-center gap-1.5 text-t-sm text-stone hover:text-rose-deep">
          <Icon icon={ChevronLeft} size={16} />
          All services
        </Link>
        {!current ? (
          <HeaderSkeleton />
        ) : 'error' in current ? (
          <Message title="Something went wrong">
            We couldn&rsquo;t load this service. Please refresh to try again.
          </Message>
        ) : !current.service ? (
          <Message title="Service not found">
            This service isn&rsquo;t available.{' '}
            <Link to="/book" className="underline decoration-rose underline-offset-4">
              See all services
            </Link>
            .
          </Message>
        ) : (
          <BookingSurface key={current.service.id} service={current.service} />
        )}
      </div>
    </main>
  )
}

// Keyed by service id so a new slug gets a fresh booking store
const BookingSurface = ({ service }: { service: ServiceDetail }) => {
  const flow = useBookingFlow(service, { window: 'month' })
  const meta = [metaLine(service), depositLabel(service)].filter(Boolean).join(' · ')

  return (
    <>
      <title>{`Book ${service.name} | Love You, Ci`}</title>
      <header className="mt-8 border-b border-(--hair) pb-10">
        <h1 className="font-display text-t-2xl leading-none">{service.name}</h1>
        {service.tagLine && <p className="mt-5 max-w-[44rem] text-t-lg leading-[1.55] text-stone">{service.tagLine}</p>}
        {meta && <p className="mt-4 text-[0.9375rem] font-normal tracking-[0.02em]">{meta}</p>}
      </header>
      <Outlet context={{ service, flow } satisfies BookingContext} />
    </>
  )
}

const HeaderSkeleton = () => (
  <div className="mt-8 border-b border-(--hair) pb-10" aria-hidden>
    <div className="h-[clamp(2.25rem,4.6vw,3.75rem)] w-1/2 animate-pulse bg-mist" />
    <div className="mt-5 h-5 w-3/4 animate-pulse bg-mist" />
    <div className="mt-4 h-4 w-1/4 animate-pulse bg-mist" />
  </div>
)

const Message = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mt-8 max-w-[36rem]">
    <title>{`${title} | Love You, Ci`}</title>
    <h1 className="font-display text-t-2xl leading-none">{title}</h1>
    <p className="mt-6 text-t-lg text-stone">{children}</p>
  </div>
)
