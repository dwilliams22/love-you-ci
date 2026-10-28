import { describe, expect, it } from 'vitest'
import { requiredMessage } from './submissions-core'
import type { FormFieldDto } from './types'

// Love You, Ci extension: the contact form's Message box asks for a message, not "an answer"
describe('requiredMessage', () => {
  const field = (control: FormFieldDto['control'], identifier = '') =>
    ({ target: 'f', label: 'F', control, identifier }) as unknown as FormFieldDto

  it('asks for a message in a multi-line field', () => {
    expect(requiredMessage(field('textarea', 'TEXT_AREA'))).toBe('Enter a message.')
  })

  it('keeps the generic copy for a single-line field', () => {
    expect(requiredMessage(field('text', 'TEXT_INPUT'))).toBe('Enter an answer.')
  })
})
