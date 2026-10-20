// Pure date helpers for the month calendar. Day keys are "YYYY-MM-DD" in the
// booking time zone, matching Slot.dayKey from the Wix data layer.

export type CalendarCell = {
  dayKey: string
  day: number
} | null

const pad = (n: number) => String(n).padStart(2, '0')

export const toDayKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

export const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1)

export const addMonths = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() + n, 1)

// Sunday-first weeks; leading blanks are null so the 1st lands on its weekday
export const monthGrid = (month: Date): CalendarCell[][] => {
  const first = startOfMonth(month)
  const daysInMonth = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate()
  const cells: CalendarCell[] = Array.from({ length: first.getDay() }, () => null)
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ dayKey: toDayKey(new Date(first.getFullYear(), first.getMonth(), day)), day })
  }
  while (cells.length % 7) cells.push(null)
  const weeks: CalendarCell[][] = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))
  return weeks
}

export const monthLabel = (month: Date) =>
  month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

// "Thursday, October 29" from a day key, without time-zone drift
export const longDayLabel = (dayKey: string) =>
  new Date(`${dayKey}T12:00:00`).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

export const shortDayLabel = (dayKey: string) =>
  new Date(`${dayKey}T12:00:00`).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

export type DayPart = 'Morning' | 'Afternoon' | 'Evening'

// Bucket by the slot's local start hour: before 12, before 17, after
export const dayPartOf = (startLocal: string): DayPart => {
  const hour = Number(startLocal.slice(11, 13))
  return hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : 'Evening'
}
