import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Icon } from '../ui/Icon'
import { monthGrid, monthLabel, toDayKey } from './calendar'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

type MonthCalendarProps = {
  month: Date
  // Day keys with at least one bookable time; null while loading
  availableDays: Set<string> | null
  selectedDay: string | null
  onSelectDay: (dayKey: string) => void
  onPrevMonth: () => void
  onNextMonth: () => void
  canGoPrev: boolean
}

const navBtn =
  'grid size-10 cursor-pointer place-items-center border border-(--hair) transition-[background,color,border-color] duration-300 enabled:hover:border-ink enabled:hover:bg-ink enabled:hover:text-paper disabled:cursor-default disabled:opacity-30'

export const MonthCalendar = ({
  month,
  availableDays,
  selectedDay,
  onSelectDay,
  onPrevMonth,
  onNextMonth,
  canGoPrev,
}: MonthCalendarProps) => {
  const today = toDayKey(new Date())

  return (
    <div>
      <div className="flex items-center justify-between">
        <button type="button" className={navBtn} onClick={onPrevMonth} disabled={!canGoPrev} aria-label="Previous month">
          <Icon icon={ChevronLeft} size={18} />
        </button>
        <p className="font-body text-t-lg tracking-[0.04em]" aria-live="polite">
          {monthLabel(month)}
        </p>
        <button type="button" className={navBtn} onClick={onNextMonth} aria-label="Next month">
          <Icon icon={ChevronRight} size={18} />
        </button>
      </div>

      <table className="mt-6 w-full table-fixed border-collapse text-center" aria-label={monthLabel(month)}>
        <thead>
          <tr>
            {WEEKDAYS.map((d) => (
              <th key={d} scope="col" className="pb-3 text-[0.75rem] font-semibold tracking-[0.14em] text-stone uppercase">
                <abbr title={d} className="no-underline">
                  {d.slice(0, 2)}
                </abbr>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={availableDays ? '' : 'animate-pulse'}>
          {monthGrid(month).map((week, w) => (
            <tr key={w}>
              {week.map((cell, d) => {
                if (!cell) return <td key={d} />
                const available = availableDays?.has(cell.dayKey) ?? false
                const selected = cell.dayKey === selectedDay
                return (
                  <td key={d} className="p-0.5">
                    <button
                      type="button"
                      disabled={!available}
                      aria-pressed={selected}
                      aria-label={new Date(`${cell.dayKey}T12:00:00`).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                      }) + (available ? '' : ', unavailable')}
                      onClick={() => onSelectDay(cell.dayKey)}
                      className={`relative mx-auto grid aspect-square w-full max-w-12 place-items-center text-[0.9375rem] transition-colors duration-300 ${
                        selected
                          ? 'bg-ink font-normal text-paper'
                          : available
                            ? 'cursor-pointer font-normal hover:bg-mist'
                            : 'text-stone-light'
                      } ${cell.dayKey === today && !selected ? 'underline decoration-rose underline-offset-4' : ''}`}
                    >
                      {cell.day}
                      {available && (
                        <span
                          className={`absolute bottom-[18%] size-1 rounded-full ${selected ? 'bg-paper' : 'bg-rose'}`}
                          aria-hidden
                        />
                      )}
                    </button>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
