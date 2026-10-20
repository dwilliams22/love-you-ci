import { useEffect, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router'
import { selectedAddOns } from '../../components/booking/selectedAddOns'
import { ChevronRight } from 'lucide-react'
import { BookingFormFields } from '../../components/booking/BookingFormFields'
import { BookingSummary } from '../../components/booking/BookingSummary'
import { Icon } from '../../components/ui/Icon'
import { useBooking } from './bookingContext'

export const DetailsPage = () => {
  const { service, flow } = useBooking()
  const navigate = useNavigate()
  const { search } = useLocation()

  // Free / pay-later services complete without checkout; this is the only real success signal
  useEffect(() => {
    if (flow.confirmed) navigate('/book/thank-you', { replace: true, state: { service: service.name, confirmed: true } })
  }, [flow.confirmed, navigate, service.name])

  // Reloading this step loses the picked time; send the visitor back to pick one
  if (!flow.selectedSlot) return <Navigate to={{ pathname: '..', search }} relative="path" replace />

  const submit = (e: FormEvent) => {
    e.preventDefault()
    // book() surfaces refusals in flow.error; paid services navigate to Wix checkout
    flow.book().catch(() => {})
  }

  const action = flow.ctaState === 'requestToBook' ? 'Request to book' : 'Book'
  const money =
    flow.payDeposit && service.deposit?.amount
      ? ` · ${service.deposit.amount} deposit`
      : service.free
        ? ' — free'
        : service.price
          ? ` · ${service.priceFrom ? 'from ' : ''}${service.price}`
          : ''

  return (
    <form
      onSubmit={submit}
      className="mt-[clamp(40px,5vw,64px)] grid grid-cols-[minmax(0,1.4fr)_minmax(280px,1fr)] gap-[clamp(32px,5vw,80px)] bp-860:grid-cols-1"
      noValidate={false}
    >
      <section aria-labelledby="details-heading">
        <div className="mb-8 flex items-baseline justify-between gap-4 border-b border-(--hair) pb-4">
          <h2 id="details-heading" className="text-[0.75rem] font-semibold tracking-[0.28em] text-rose-deep">
            YOUR DETAILS
          </h2>
          <Link to={{ pathname: '..', search }} relative="path" className="text-t-sm text-stone hover:text-rose-deep">
            Change date &amp; time
          </Link>
        </div>
        {flow.formFields.length ? (
          <BookingFormFields fields={flow.formFields} values={flow.values} onChange={flow.setValue} />
        ) : (
          <div className="flex animate-pulse flex-col gap-6" aria-hidden>
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="h-[74px] bg-mist" />
            ))}
          </div>
        )}
      </section>

      <div className="self-start">
        <BookingSummary
          service={service}
          slot={flow.selectedSlot}
          timeZoneLabel={flow.timeZoneLabel}
          addOns={selectedAddOns(flow)}
          addOnsMinutes={flow.addOnsMinutes}
        >
          <button
            type="submit"
            className="cta w-full cursor-pointer justify-center disabled:cursor-default disabled:opacity-40"
            disabled={!flow.canBook}
          >
            {flow.booking ? 'Securing your time…' : `${action}${money}`}
            {!flow.booking && <Icon icon={ChevronRight} size={16} />}
          </button>
          {flow.error && (
            <p className="mt-4 text-t-sm text-rose-deep" role="alert">
              {flow.error}
            </p>
          )}
          {service.deposit && !service.free && (
            <p className="mt-4 text-[0.8125rem] leading-[1.5] text-stone">
              You&rsquo;ll pay the deposit on Wix&rsquo;s secure checkout.
            </p>
          )}
        </BookingSummary>
      </div>
    </form>
  )
}
