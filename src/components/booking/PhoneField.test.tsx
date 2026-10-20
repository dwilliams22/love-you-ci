import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { PhoneField } from './PhoneField'

const setup = (value = '') => {
  const onChange = vi.fn()
  render(<PhoneField id="phone" value={value} required inputClassName="" onChange={onChange} />)
  return { onChange, input: screen.getByRole('textbox'), country: screen.getByRole('combobox', { name: 'Country code' }) }
}

describe('PhoneField', () => {
  it('defaults to the United States (+1)', () => {
    const { country } = setup()
    expect(country).toHaveValue('US')
    expect(screen.getByText('+1')).toBeInTheDocument()
  })

  it('formats as you type and sends +1 E.164 once valid', async () => {
    const { input, onChange } = setup()
    await userEvent.type(input, '4048675309')
    expect(input).toHaveValue('(404) 867-5309')
    expect(onChange).toHaveBeenLastCalledWith('+14048675309')
  })

  it('sends empty until the number is valid and flags it on blur', async () => {
    const { input, onChange } = setup()
    await userEvent.type(input, '404867')
    expect(onChange).toHaveBeenLastCalledWith('')
    await userEvent.tab()
    expect(screen.getByText('Enter a valid United States phone number.')).toBeInTheDocument()
    expect(input).toHaveAttribute('aria-invalid', 'true')
  })

  it('uses the chosen country code', async () => {
    const { input, country, onChange } = setup()
    await userEvent.selectOptions(country, 'GB')
    await userEvent.type(input, '7911123456')
    expect(onChange).toHaveBeenLastCalledWith('+447911123456')
  })

  it('restores a saved number', () => {
    const { input, country } = setup('+14048675309')
    expect(country).toHaveValue('US')
    expect(input).toHaveValue('(404) 867-5309')
  })
})
