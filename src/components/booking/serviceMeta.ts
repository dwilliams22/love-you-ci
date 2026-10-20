import type { ServiceSummary, Weekday } from '../../wix/bookings/types'

const DAY_SHORT: Record<Weekday, string> = {
  SUNDAY: 'Sun',
  MONDAY: 'Mon',
  TUESDAY: 'Tue',
  WEDNESDAY: 'Wed',
  THURSDAY: 'Thu',
  FRIDAY: 'Fri',
  SATURDAY: 'Sat',
}

export const offeredDaysLabel = (days: Weekday[]) => days.map((d) => DAY_SHORT[d]).join(', ')

// Price line per the Wix playbook: money strings are final, "" means omit
export const priceLabel = (s: ServiceSummary) => (s.price ? `${s.priceFrom ? 'From ' : ''}${s.price}` : '')

// "75 min · $125"
export const metaLine = (s: ServiceSummary) => [s.durationLabel, priceLabel(s)].filter(Boolean).join(' · ')

export const depositLabel = (s: ServiceSummary) => (s.deposit?.amount ? `${s.deposit.amount} deposit` : '')
