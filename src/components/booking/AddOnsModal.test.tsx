import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { AddOnGroup, ServiceSummary } from '../../wix/bookings/types'
import { AddOnsModal } from './AddOnsModal'

const service = { name: 'Natural Glam', durationLabel: '45 min', price: '$115', priceFrom: false } as ServiceSummary
const groups: AddOnGroup[] = [
  {
    id: 'g1',
    name: 'Makeup Add-ons',
    prompt: 'Select items to add to your glam!',
    maxSelectable: null,
    addOns: [
      { id: 'bottom', name: 'Bottom Lashes', price: '$5', priceAmount: 5, currency: 'USD', durationMinutes: 5, maxQuantity: null },
      { id: 'mink', name: 'Mink Lashes', price: '$10', priceAmount: 10, currency: 'USD', durationMinutes: null, maxQuantity: 1 },
    ],
  },
]

const setup = (props: Partial<Parameters<typeof AddOnsModal>[0]> = {}) => {
  const onNext = vi.fn()
  const onClose = vi.fn()
  render(<AddOnsModal service={service} groups={groups} initialSelected={[]} onNext={onNext} onClose={onClose} {...props} />)
  return { onNext, onClose }
}

describe('AddOnsModal', () => {
  it('lists the group, prompt, prices and extra minutes', () => {
    setup()
    expect(screen.getByRole('dialog', { name: 'Natural Glam' })).toBeInTheDocument()
    expect(screen.getByText('Select items to add to your glam!')).toBeInTheDocument()
    expect(screen.getByText('+5 min')).toBeInTheDocument()
    expect(screen.getByText('$10')).toBeInTheDocument()
  })

  it('toggles add-ons, totals them and passes the ids to Next', async () => {
    const { onNext } = setup()
    await userEvent.click(screen.getByRole('button', { name: 'Add Bottom Lashes' }))
    await userEvent.click(screen.getByRole('button', { name: 'Add Mink Lashes' }))
    expect(screen.getByRole('button', { name: 'Remove Mink Lashes' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('2 add-ons · +$15 · +5 min')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: /Next/ }))
    expect(onNext).toHaveBeenCalledWith(['bottom', 'mink'])
  })

  it('starts from the current selection when editing', () => {
    setup({ initialSelected: ['mink'] })
    expect(screen.getByRole('button', { name: 'Remove Mink Lashes' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('closes from the X button', async () => {
    const { onClose } = setup()
    await userEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(onClose).toHaveBeenCalled()
  })

  it('disables Next while add-ons load', () => {
    setup({ groups: null })
    expect(screen.getByRole('button', { name: /Next/ })).toBeDisabled()
  })
})
