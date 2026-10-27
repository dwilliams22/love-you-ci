import { useEffect, useRef, useState } from 'react'
import { Check, ChevronRight, X } from 'lucide-react'
import { addOnsDuration, addOnsTotal } from '../../wix/bookings/booking-core'
import type { AddOnGroup, ServiceSummary } from '../../wix/bookings/types'
import { Icon } from '../ui/Icon'
import { metaLine } from './serviceMeta'

type AddOnsModalProps = {
  service: ServiceSummary
  // null while the add-ons load
  groups: AddOnGroup[] | null
  initialSelected: string[]
  onNext: (addOnIds: string[]) => void
  // X, Esc or a click on the backdrop
  onClose: () => void
}

const sectionLabel = 'text-[0.75rem] font-semibold tracking-[0.28em] text-rose-deep'

export const AddOnsModal = ({ service, groups, initialSelected, onNext, onClose }: AddOnsModalProps) => {
  const dialog = useRef<HTMLDialogElement>(null)
  const [selected, setSelected] = useState(() => new Set(initialSelected))

  useEffect(() => {
    const d = dialog.current
    d?.showModal()
    return () => d?.close()
  }, [])

  const toggle = (id: string) => {
    const next = new Set(selected)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelected(next)
  }

  const selection = Object.fromEntries([...selected].map((id) => [id, 1]))
  const extraPrice = groups ? addOnsTotal(groups, selection) : ''
  const extraMinutes = groups ? addOnsDuration(groups, selection) : 0
  const extras = [extraPrice && `+${extraPrice}`, extraMinutes && `+${extraMinutes} min`].filter(Boolean).join(' · ')

  return (
    <dialog
      ref={dialog}
      aria-labelledby="addons-title"
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      // A click on the ::backdrop lands on the dialog element itself
      onClick={(e) => e.target === dialog.current && onClose()}
      // In a short window (a phone on its side) the header and footer would squeeze the list to
      // nothing, so the whole dialog scrolls instead, with the footer pinned
      className="m-auto max-h-[min(88dvh,760px)] w-[min(640px,calc(100vw-32px))] flex-col [@media(max-height:520px)]:overflow-y-auto bg-paper p-0 text-ink shadow-[0_40px_80px_-40px_rgba(22,20,21,0.6)] backdrop:bg-ink/55 backdrop:backdrop-blur-[2px] open:flex open:animate-[rise_0.5s_var(--ease-brand)_both]"
    >
      <header className="flex items-start justify-between gap-6 px-[clamp(24px,4vw,44px)] pt-[clamp(24px,4vw,40px)]">
        <div>
          <p className={sectionLabel}>CUSTOMIZE YOUR GLAM</p>
          <h2 id="addons-title" className="mt-3 text-t-lg leading-tight font-semibold tracking-[0.2em] uppercase">
            {service.name}
          </h2>
          <p className="mt-1 text-t-sm text-stone">{metaLine(service)}</p>
        </div>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="-mt-1 -mr-2 grid size-11 shrink-0 cursor-pointer place-items-center transition-colors duration-300 hover:text-rose-deep"
        >
          <Icon icon={X} size={22} />
        </button>
      </header>

      <div className="mt-6 flex-1 overflow-y-auto px-[clamp(24px,4vw,44px)] pb-6 [@media(max-height:520px)]:flex-none [@media(max-height:520px)]:overflow-visible">
        {groups === null ? (
          <div className="flex animate-pulse flex-col gap-3" aria-label="Loading add-ons">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="h-16 bg-mist" />
            ))}
          </div>
        ) : groups.length === 0 ? (
          <p className="text-stone">This service has no add-ons.</p>
        ) : (
          groups.map((group) => (
            <fieldset key={group.id} className="border-t border-(--hair) pt-6 first:border-t-0 first:pt-0">
              <legend className="text-[0.9375rem] leading-tight font-semibold tracking-[0.2em] uppercase">{group.name}</legend>
              {group.prompt && <p className="mt-1 text-t-sm text-stone">{group.prompt}</p>}
              <ul className="mt-4">
                {group.addOns.map((addOn) => {
                  const on = selected.has(addOn.id)
                  return (
                    <li key={addOn.id} className="flex items-center gap-4 border-b border-(--hair) py-4 last:border-b-0">
                      <div className="min-w-0 flex-1">
                        <p className="text-t-base font-normal">{addOn.name}</p>
                        {addOn.durationMinutes ? (
                          <p className="text-t-sm text-stone">+{addOn.durationMinutes} min</p>
                        ) : null}
                      </div>
                      {addOn.price && <p className="text-t-base font-normal tabular-nums">{addOn.price}</p>}
                      <button
                        type="button"
                        aria-pressed={on}
                        aria-label={`${on ? 'Remove' : 'Add'} ${addOn.name}`}
                        onClick={() => toggle(addOn.id)}
                        className={`inline-flex min-h-11 w-[104px] shrink-0 cursor-pointer items-center justify-center gap-1.5 border text-[0.875rem] font-medium tracking-[0.04em] transition-[background,color,border-color] duration-300 ${
                          on ? 'border-ink bg-ink text-paper' : 'border-ink hover:bg-ink hover:text-paper'
                        }`}
                      >
                        {on ? (
                          <>
                            <Icon icon={Check} size={15} /> Added
                          </>
                        ) : (
                          'Add'
                        )}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </fieldset>
          ))
        )}
      </div>

      <footer className="flex items-center justify-between gap-4 border-t border-(--hair) bg-paper px-[clamp(24px,4vw,44px)] py-5 [@media(max-height:520px)]:sticky [@media(max-height:520px)]:bottom-0">
        <p className="text-t-sm text-stone" aria-live="polite">
          {selected.size ? `${selected.size} add-on${selected.size > 1 ? 's' : ''}${extras ? ` · ${extras}` : ''}` : 'No add-ons selected'}
        </p>
        <button
          type="button"
          className="cta cursor-pointer disabled:cursor-default disabled:opacity-40"
          disabled={groups === null}
          onClick={() => onNext([...selected])}
        >
          Next <Icon icon={ChevronRight} size={16} />
        </button>
      </footer>
    </dialog>
  )
}
