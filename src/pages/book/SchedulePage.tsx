import { useLocation, useNavigate } from 'react-router'
import { selectedAddOns } from '../../components/booking/selectedAddOns'
import { ChevronRight } from 'lucide-react'
import { BookingSummary } from '../../components/booking/BookingSummary'
import { MonthCalendar } from '../../components/booking/MonthCalendar'
import { TimeSlots } from '../../components/booking/TimeSlots'
import { longDayLabel, shortDayLabel, startOfMonth } from '../../components/booking/calendar'
import { Icon } from '../../components/ui/Icon'
import { useBooking } from './bookingContext'
import { useState } from 'react'

const sectionLabel = 'text-[0.75rem] font-semibold tracking-[0.28em] text-rose-deep'
const sectionHead = 'mb-8 flex h-12 items-center justify-between gap-4 border-b border-(--hair)'

export const SchedulePage = () => {
  const { service, flow, editAddOns } = useBooking()
  const navigate = useNavigate()
  const { search } = useLocation()
  const [pickedDay, setPickedDay] = useState<string | null>(flow.selectedSlot?.dayKey ?? null)

  const days = flow.days
  const availableDays = days ? new Set(days.filter((d) => d.slots.some((s) => s.bookable)).map((d) => d.dayKey)) : null
  // Default to the first day with times once the month loads
  const firstAvailable = days?.find((d) => availableDays?.has(d.dayKey))?.dayKey ?? null
  const selectedDay = pickedDay && days?.some((d) => d.dayKey === pickedDay) ? pickedDay : firstAvailable
  const daySlots = days?.find((d) => d.dayKey === selectedDay)?.slots ?? []
  const canGoPrev = flow.month > startOfMonth(new Date())

  const selectDay = (dayKey: string) => {
    setPickedDay(dayKey)
    if (flow.selectedSlot?.dayKey !== dayKey) flow.setSelectedSlot(null)
  }

  return (
    <div className="mt-[clamp(40px,5vw,64px)] grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(280px,0.85fr)] gap-[clamp(32px,4vw,64px)] bp-1080:grid-cols-2 bp-860:grid-cols-1">
      <section aria-labelledby="date-heading">
        <div className={sectionHead}>
          <h2 id="date-heading" className={sectionLabel}>
            SELECT A DATE
          </h2>
        </div>
        <MonthCalendar
          month={flow.month}
          availableDays={availableDays}
          selectedDay={selectedDay}
          onSelectDay={selectDay}
          onPrevMonth={flow.prevMonth}
          onNextMonth={flow.nextMonth}
          canGoPrev={canGoPrev}
        />
      </section>

      <section aria-labelledby="time-heading" aria-live="polite">
        <div className={sectionHead}>
          <h2 id="time-heading" className={sectionLabel}>
            SELECT A TIME
          </h2>
          {flow.timeZoneLabel && <p className="text-t-sm text-stone">{flow.timeZoneLabel}</p>}
        </div>
        {days === null ? (
          <SlotsSkeleton />
        ) : selectedDay ? (
          <>
            <p className="mb-6 font-body text-t-xl">{longDayLabel(selectedDay)}</p>
            <TimeSlots
              slots={daySlots}
              selected={flow.selectedSlot}
              onSelect={flow.setSelectedSlot}
              showCapacity={service.type !== 'APPOINTMENT'}
            />
          </>
        ) : (
          <NoTimes flow={flow} onJump={(dayKey) => {
            setPickedDay(dayKey)
            flow.jumpTo(dayKey)
          }} />
        )}
        {flow.error && (
          <p className="mt-6 text-t-sm text-rose-deep" role="alert">
            {flow.error}
          </p>
        )}
      </section>

      <div className="bp-1080:col-span-2 bp-860:col-span-1">
        <BookingSummary
          service={service}
          slot={flow.selectedSlot}
          timeZoneLabel={flow.timeZoneLabel}
          addOns={selectedAddOns(flow)}
          addOnsMinutes={flow.addOnsMinutes}
          onEditAddOns={service.hasAddOns ? editAddOns : undefined}
        >
          <button
            type="button"
            className="cta w-full cursor-pointer justify-center disabled:cursor-default disabled:opacity-40"
            disabled={!flow.selectedSlot}
            onClick={() => navigate({ pathname: 'details', search })}
          >
            Continue <Icon icon={ChevronRight} size={16} />
          </button>
        </BookingSummary>
      </div>
    </div>
  )
}

type NoTimesProps = {
  flow: ReturnType<typeof useBooking>['flow']
  onJump: (dayKey: string) => void
}

const NoTimes = ({ flow, onJump }: NoTimesProps) => {
  const next = flow.nextAvailable?.[0]
  return (
    <div className="text-stone">
      <p>No available times this month.</p>
      {flow.nextAvailable === null ? (
        <p className="mt-2 text-t-sm">Looking for the next opening…</p>
      ) : next ? (
        <button type="button" className="text-link cursor-pointer text-ink" onClick={() => onJump(next.dayKey)}>
          Next available: {shortDayLabel(next.dayKey)} <Icon icon={ChevronRight} size={15} />
        </button>
      ) : (
        <p className="mt-2 text-t-sm">There are no openings in the coming months.</p>
      )}
    </div>
  )
}

const SlotsSkeleton = () => (
  <div className="animate-pulse" aria-hidden>
    <div className="mb-6 h-8 w-2/3 bg-mist" />
    <div className="grid grid-cols-[repeat(auto-fill,minmax(112px,1fr))] gap-2.5">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="h-12 bg-mist" />
      ))}
    </div>
  </div>
)
