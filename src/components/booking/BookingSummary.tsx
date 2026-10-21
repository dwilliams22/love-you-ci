import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { AddOn, Slot, ServiceDetail } from '../../wix/bookings/types'
import { Icon } from '../ui/Icon'
import { shortDayLabel } from './calendar'
import { metaLine } from './serviceMeta'
import { studioAddress } from '../../content/bookingPolicy'
import type { ReactNode } from 'react'

type BookingSummaryProps = {
  service: ServiceDetail
  slot: Slot | null
  timeZoneLabel: string
  addOns?: AddOn[]
  addOnsMinutes?: number
  // Shows an "Edit" link for add-ons (calendar step only)
  onEditAddOns?: () => void
  children?: ReactNode
}

// Strip any HTML/markdown emphasis from the owner's description for plain display
const plainText = (s: string) => s.replace(/<[^>]+>/g, ' ').replace(/\*\*/g, '').replace(/\s+/g, ' ').trim()

export const BookingSummary = ({
  service,
  slot,
  timeZoneLabel,
  addOns = [],
  addOnsMinutes = 0,
  onEditAddOns,
  children,
}: BookingSummaryProps) => {
  const [open, setOpen] = useState(false)
  const details = [service.tagLine, plainText(service.description)].filter(Boolean)

  return (
    <aside className="bg-mist p-[clamp(24px,3vw,36px)]" aria-label="Booking summary">
      <h2 className="text-[0.75rem] font-semibold tracking-[0.28em] text-rose-deep">SERVICE DETAILS</h2>
      <p className="mt-4 text-t-lg leading-tight font-semibold tracking-[0.2em] uppercase">{service.name}</p>
      <p className="mt-1 text-t-sm text-stone">{metaLine(service)}</p>

      {details.length > 0 && (
        <div className="mt-4">
          <button
            type="button"
            className="flex w-full cursor-pointer items-center justify-between text-t-sm text-stone hover:text-ink"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            More details
            <Icon icon={ChevronDown} size={16} className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
          </button>
          {open && (
            <div className="mt-3 flex flex-col gap-2 text-t-sm leading-[1.6]">
              {details.map((d) => (
                <p key={d}>{d}</p>
              ))}
            </div>
          )}
        </div>
      )}

      <dl className="mt-6 flex flex-col gap-4 border-t border-(--hair) pt-6 text-t-sm">
        {(service.hasAddOns || addOns.length > 0) && (
          <div>
            <dt className="flex items-baseline justify-between text-stone">
              Add-ons
              {onEditAddOns && (
                <button
                  type="button"
                  className="cursor-pointer text-ink underline decoration-rose underline-offset-4 hover:text-rose-deep"
                  onClick={onEditAddOns}
                >
                  Edit
                </button>
              )}
            </dt>
            {addOns.length ? (
              <>
                {addOns.map((a) => (
                  <dd key={a.id} className="mt-0.5 flex justify-between gap-4 text-[0.9375rem] font-normal">
                    <span>{a.name}</span>
                    {a.price && <span className="tabular-nums">{a.price}</span>}
                  </dd>
                ))}
                {addOnsMinutes > 0 && <dd className="text-stone">Adds {addOnsMinutes} min to your appointment</dd>}
              </>
            ) : (
              <dd className="mt-0.5">None</dd>
            )}
          </div>
        )}
        <div>
          <dt className="text-stone">Date &amp; time</dt>
          <dd className="mt-0.5 text-[0.9375rem] font-normal">
            {slot ? `${shortDayLabel(slot.dayKey)} · ${slot.label}` : 'Choose a date and time'}
          </dd>
          {slot && timeZoneLabel && <dd className="text-stone">{timeZoneLabel}</dd>}
        </div>
        {service.deposit?.amount && (
          <div>
            <dt className="text-stone">Due today</dt>
            <dd className="mt-0.5 text-[0.9375rem] font-normal">{service.deposit.amount} deposit</dd>
          </div>
        )}
        <div>
          <dt className="text-stone">Location</dt>
          <dd className="mt-0.5 text-[0.9375rem] font-normal">
            {studioAddress.street}, {studioAddress.cityLine}
          </dd>
          <dd className="text-stone">Suite number sent in your confirmation email</dd>
        </div>
      </dl>

      {children && <div className="mt-8">{children}</div>}
    </aside>
  )
}
