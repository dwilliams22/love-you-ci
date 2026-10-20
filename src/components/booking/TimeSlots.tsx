import type { Slot } from '../../wix/bookings/types'
import { dayPartOf, type DayPart } from './calendar'

const PARTS: DayPart[] = ['Morning', 'Afternoon', 'Evening']

type TimeSlotsProps = {
  slots: Slot[]
  selected: Slot | null
  onSelect: (slot: Slot) => void
  // Seats left only mean something for classes; an appointment slot is always 1
  showCapacity: boolean
}

export const TimeSlots = ({ slots, selected, onSelect, showCapacity }: TimeSlotsProps) => (
  <div className="flex flex-col gap-7">
    {PARTS.map((part) => {
      const partSlots = slots.filter((s) => dayPartOf(s.startLocal) === part)
      if (!partSlots.length) return null
      return (
        <fieldset key={part}>
          <legend className="mb-3 text-[0.75rem] font-semibold tracking-[0.28em] text-stone uppercase">{part}</legend>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(112px,1fr))] gap-2.5">
            {partSlots.map((slot) => {
              const isSelected = selected?.key === slot.key
              const few = showCapacity && slot.remainingCapacity !== null && slot.remainingCapacity > 0 && slot.remainingCapacity <= 3
              return (
                <button
                  key={slot.key}
                  type="button"
                  disabled={!slot.bookable}
                  aria-pressed={isSelected}
                  onClick={() => onSelect(slot)}
                  className={`flex min-h-12 cursor-pointer flex-col items-center justify-center border px-3 text-[0.9375rem] font-normal tracking-[0.02em] transition-[background,color,border-color] duration-300 disabled:cursor-default disabled:text-stone-light ${
                    isSelected
                      ? 'border-ink bg-ink text-paper'
                      : 'border-(--hair) enabled:hover:border-ink'
                  }`}
                >
                  {slot.label}
                  {!slot.bookable ? (
                    <span className="text-[0.6875rem] tracking-[0.08em] uppercase">
                      {slot.waitlistCapacity ? 'Full, waitlist' : 'Full'}
                    </span>
                  ) : (
                    few && <span className="text-[0.6875rem] tracking-[0.08em] text-rose-deep">{slot.remainingCapacity} left</span>
                  )}
                </button>
              )
            })}
          </div>
        </fieldset>
      )
    })}
  </div>
)
