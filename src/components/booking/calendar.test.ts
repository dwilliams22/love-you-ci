import { describe, expect, it } from 'vitest'
import { dayPartOf, longDayLabel, monthGrid, toDayKey } from './calendar'

describe('monthGrid', () => {
  it('starts October 2026 on Thursday with Sunday-first weeks', () => {
    const weeks = monthGrid(new Date(2026, 9, 15))
    expect(weeks[0].slice(0, 4)).toEqual([null, null, null, null])
    expect(weeks[0][4]).toEqual({ dayKey: '2026-10-01', day: 1 })
    expect(weeks.flat().filter(Boolean)).toHaveLength(31)
    expect(weeks.every((w) => w.length === 7)).toBe(true)
  })
})

describe('day helpers', () => {
  it('formats day keys and labels without time-zone drift', () => {
    expect(toDayKey(new Date(2026, 0, 5))).toBe('2026-01-05')
    expect(longDayLabel('2026-10-29')).toBe('Thursday, October 29')
  })

  it('buckets slot starts into parts of the day', () => {
    expect(dayPartOf('2026-10-29T10:00:00')).toBe('Morning')
    expect(dayPartOf('2026-10-29T12:00:00')).toBe('Afternoon')
    expect(dayPartOf('2026-10-29T17:30:00')).toBe('Evening')
  })
})
