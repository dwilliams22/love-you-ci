import type { BookingFormField } from '../../wix/bookings/types'
import { PhoneField } from './PhoneField'

type BookingFormFieldsProps = {
  fields: BookingFormField[]
  values: Record<string, string>
  onChange: (target: string, value: string) => void
}

const inputType: Record<BookingFormField['type'], string> = {
  STRING: 'text',
  EMAIL: 'email',
  PHONE: 'tel',
  NUMBER: 'number',
  URL: 'url',
}

const autoComplete: Record<string, string> = {
  first_name: 'name',
  last_name: 'family-name',
  email: 'email',
  phone: 'tel',
}

const control =
  'w-full border border-(--hair) bg-paper px-4 py-3 text-t-base font-normal transition-colors duration-300 outline-none focus:border-ink focus-visible:outline-none'

// Owner-written labels can carry "**bold**" and blank-line notes; first line is the label, the rest is help text
const splitLabel = (label: string) => {
  const [first, ...rest] = label.replace(/\*\*/g, '').split(/\n+/)
  return { text: first.trim(), help: rest.join(' ').trim() }
}

export const BookingFormFields = ({ fields, values, onChange }: BookingFormFieldsProps) => (
  <div className="flex flex-col gap-6">
    {fields.map((f) => {
      const id = `field-${f.target}`
      const { text, help } = splitLabel(f.label)
      return (
        <div key={f.target}>
          <label htmlFor={id} className="text-t-sm font-normal tracking-[0.02em]">
            {text}
            {f.required ? <span className="text-rose-deep"> *</span> : <span className="text-stone"> (optional)</span>}
          </label>
          {help && (
            <p id={`${id}-help`} className="mt-1 text-[0.8125rem] leading-[1.5] text-stone">
              {help}
            </p>
          )}
          {f.type === 'PHONE' ? (
            <PhoneField
              id={id}
              value={values[f.target] ?? ''}
              required={f.required}
              describedBy={help ? `${id}-help` : undefined}
              inputClassName={control}
              onChange={(v) => onChange(f.target, v)}
            />
          ) : f.options?.length ? (
            <select
              id={id}
              className={`mt-2 ${control}`}
              value={values[f.target] ?? ''}
              required={f.required}
              onChange={(e) => onChange(f.target, e.target.value)}
            >
              <option value="">Select…</option>
              {f.options.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          ) : (
            <input
              id={id}
              className={`mt-2 ${control}`}
              type={inputType[f.type]}
              autoComplete={autoComplete[f.target]}
              aria-describedby={help ? `${id}-help` : undefined}
              value={values[f.target] ?? ''}
              required={f.required}
              onChange={(e) => onChange(f.target, e.target.value)}
            />
          )}
        </div>
      )
    })}
  </div>
)
