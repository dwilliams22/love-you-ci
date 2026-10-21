import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { UseWixForm } from '../../hooks/forms/useWixForm'
import type { FormDto, FormFieldDto } from '../../wix/forms/types'
import { ContactForm } from './ContactForm'

const hook = vi.hoisted(() => ({ state: {} as Partial<UseWixForm> }))

vi.mock('../../hooks/forms/useWixForm', () => ({
  FORM_ERROR: '__form',
  useWixForm: () => hook.state,
}))

const field = (over: Partial<FormFieldDto>): FormFieldDto => ({
  target: 't',
  label: 'L',
  showLabel: true,
  control: 'text',
  required: false,
  readOnly: false,
  hidden: false,
  stepId: 's1',
  defaultValue: '',
  choices: [],
  addressParts: [],
  validation: {},
  identifier: 'TEXT_INPUT',
  inputType: 'STRING',
  componentType: 'TEXT_INPUT',
  ...over,
})

const form = {
  id: 'f',
  name: 'Contact',
  fields: [
    field({ target: 'first', label: 'First Name', identifier: 'CONTACTS_FIRST_NAME' }),
    field({ target: 'email', label: 'Email', control: 'email', required: true, identifier: 'CONTACTS_EMAIL' }),
    field({ target: 'msg', label: 'Message', control: 'textarea', identifier: 'TEXT_AREA' }),
  ],
  steps: [{ id: 's1', name: '', targets: ['first', 'email', 'msg'] }],
  rules: [],
  submitText: 'Send',
  nextText: '',
  previousText: '',
  enabled: true,
  disabledMessage: '',
  limits: {},
  requiredIndicator: 'ASTERISK',
  requiredIndicatorBefore: false,
  success: { action: 'THANK_YOU_MESSAGE' },
} as unknown as FormDto

const base = (): Partial<UseWixForm> => ({
  form,
  values: {},
  errors: {},
  loading: false,
  step: 0,
  closed: false,
  outcome: null,
  bind: (target: string) => ({
    name: target,
    value: '',
    onChange: () => {},
    onBlur: () => {},
    'aria-describedby': `err-${target}`,
    'aria-invalid': undefined,
  }),
  submit: vi.fn(),
  reset: vi.fn(),
})

describe('ContactForm', () => {
  beforeEach(() => {
    hook.state = base()
  })

  it('renders the fields from the Wix schema with the owner button text', () => {
    render(<ContactForm formId="f" />)
    expect(screen.getByLabelText('First Name')).toHaveAttribute('autocomplete', 'given-name')
    expect(screen.getByLabelText('Email *')).toHaveAttribute('type', 'email')
    expect(screen.getByLabelText('Message').tagName).toBe('TEXTAREA')
    expect(screen.getByRole('button', { name: 'Send' })).toHaveAttribute('type', 'submit')
  })

  it('shows a field error from the store', () => {
    hook.state = { ...base(), errors: { email: 'Enter an email address like example@mysite.com.' } }
    render(<ContactForm formId="f" />)
    expect(screen.getByText('Enter an email address like example@mysite.com.')).toHaveAttribute('id', 'err-email')
  })

  it('replaces the form with the thank-you message after sending', () => {
    hook.state = {
      ...base(),
      outcome: { submission: { id: 'x', status: 'CONFIRMED' }, action: 'THANK_YOU_MESSAGE', message: 'Thanks, love!' },
    } as Partial<UseWixForm>
    render(<ContactForm formId="f" />)
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Thank you' })).toHaveFocus()
    expect(screen.getByRole('status')).toHaveTextContent('Thanks, love!')
  })

  it('shows a skeleton while the form loads', () => {
    hook.state = { ...base(), form: null }
    render(<ContactForm formId="f" />)
    expect(screen.getByLabelText('Loading the contact form')).toHaveAttribute('aria-busy', 'true')
  })
})
