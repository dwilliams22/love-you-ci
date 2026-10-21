import { ChevronRight } from 'lucide-react'
import { FORM_ERROR, useWixForm } from '../../hooks/forms/useWixForm'
import type { FormDto, FormFieldDto } from '../../wix/forms/types'
import { Icon } from '../ui/Icon'

type ContactFormProps = {
  formId: string
}

// Fields are schema-driven: Ci can rename, add or reorder them in her Wix dashboard.
// Only the contact-name kinds sit side by side; everything else takes the full row.
const HALF_WIDTH = new Set(['CONTACTS_FIRST_NAME', 'CONTACTS_LAST_NAME'])

const AUTOCOMPLETE: Record<string, string> = {
  CONTACTS_FIRST_NAME: 'given-name',
  CONTACTS_LAST_NAME: 'family-name',
  CONTACTS_EMAIL: 'email',
  CONTACTS_PHONE: 'tel',
  CONTACTS_COMPANY: 'organization',
}

const INPUT_TYPE: Partial<Record<FormFieldDto['control'], string>> = {
  text: 'text',
  email: 'email',
  phone: 'tel',
  url: 'url',
  password: 'password',
  number: 'number',
  rating: 'number',
  date: 'date',
  time: 'time',
  datetime: 'datetime-local',
}

const labelClass = 'block text-[0.75rem] font-medium tracking-[0.18em] text-stone uppercase'

const controlClass =
  'mt-2 block w-full rounded-none border-0 border-b border-(--hair) bg-transparent px-0 py-2.5 text-t-base font-normal text-ink transition-[border-color,box-shadow] duration-300 outline-none focus:border-ink focus:shadow-[0_1px_0_var(--color-ink)] focus-visible:outline-none aria-invalid:border-rose-deep autofill:shadow-[inset_0_0_0_1000px_var(--color-mist)]'

// The error line's height is always reserved: an error appearing on blur must not push the
// Send button down mid-click (the click would miss and the visitor would have to click again).
const errorClass = 'mt-1.5 min-h-[1.3125rem] text-[0.8125rem] leading-[1.3125rem] text-rose-deep'

const RequiredMark = ({ form }: { form: FormDto }) => {
  if (form.requiredIndicator === 'NONE') return null
  const mark = form.requiredIndicator === 'TEXT' ? ' (Required)' : ' *'
  return <span className="text-rose-deep">{mark}</span>
}

const FieldLabel = ({ field, form, htmlFor }: { field: FormFieldDto; form: FormDto; htmlFor?: string }) => {
  if (!field.showLabel) return null
  const before = form.requiredIndicatorBefore
  const Tag = htmlFor ? 'label' : 'span'
  return (
    <Tag htmlFor={htmlFor} className={labelClass}>
      {field.required && before && <RequiredMark form={form} />}
      {field.label}
      {field.required && !before && <RequiredMark form={form} />}
    </Tag>
  )
}

export const ContactForm = ({ formId }: ContactFormProps) => {
  const f = useWixForm(formId)

  if (f.outcome) {
    const message = f.outcome.message || 'Thank you for reaching out! Your message has been sent.'
    return (
      <div className="flex min-h-[26rem] flex-col items-center justify-center bg-mist p-[clamp(28px,4vw,56px)] text-center">
        <h2 tabIndex={-1} ref={(el) => el?.focus()} className="font-display text-t-2xl leading-none outline-none">
          Thank you
        </h2>
        <div role="status" className="mt-6 max-w-[28rem] text-t-lg leading-[1.55] text-balance text-stone">
          {message.split('\n').filter(Boolean).map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
        {/* The gradient only paints inside the box; padding covers the script's loops past the 1em line, and the margins cancel it out */}
        <p className="rose-gold-text mt-[calc(2rem-0.15em)] -mb-[0.15em] p-[0.15em] font-script text-[clamp(2.5rem,4vw,3.25rem)] leading-none">
          Love you, Ci
        </p>
        <button type="button" onClick={f.reset} className="text-link mt-10 cursor-pointer">
          Send another message <Icon icon={ChevronRight} size={15} />
        </button>
      </div>
    )
  }

  if (!f.form) {
    if (f.errors[FORM_ERROR]) {
      return (
        <p className="bg-mist p-[clamp(28px,4vw,56px)] text-stone" role="alert">
          The contact form couldn&rsquo;t load right now. Please refresh to try again.
        </p>
      )
    }
    return (
      <div aria-busy="true" aria-label="Loading the contact form" className="grid grid-cols-2 gap-x-8 gap-y-9 bg-mist p-[clamp(28px,4vw,56px)] bp-560:grid-cols-1">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={i > 2 ? 'col-span-full' : ''}>
            <div className="h-3 w-24 animate-pulse bg-(--hair)" />
            <div className={`mt-4 border-b border-(--hair) ${i === 4 ? 'h-32' : 'h-8'}`} />
          </div>
        ))}
      </div>
    )
  }

  const form = f.form

  if (f.closed) {
    return (
      <p className="bg-mist p-[clamp(28px,4vw,56px)] text-stone">
        {form.disabledMessage || 'This form isn’t accepting messages right now.'}
      </p>
    )
  }

  const step = form.steps[f.step]
  const last = f.step === form.steps.length - 1
  const fields = form.fields.filter((x) => x.stepId === step.id)

  const renderControl = (field: FormFieldDto) => {
    const id = `field-${field.target}`
    const common = {
      id,
      required: field.required,
      disabled: field.readOnly,
      placeholder: field.placeholder,
      'aria-label': field.showLabel ? undefined : field.label,
    }

    if (field.control === 'textarea') {
      return <textarea {...common} {...f.bind(field.target)} rows={5} className={`${controlClass} min-h-32 resize-y`} />
    }

    if (field.control === 'select') {
      return (
        <select {...common} {...f.bind(field.target)} className={`${controlClass} cursor-pointer`}>
          <option value="">{field.placeholder || 'Choose…'}</option>
          {field.choices.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      )
    }

    if (field.control === 'checkbox') {
      return (
        <label className="mt-1 flex cursor-pointer items-start gap-3 text-t-base">
          <input
            type="checkbox"
            name={field.target}
            checked={f.values[field.target] === true}
            onChange={(e) => f.setValues((v) => ({ ...v, [field.target]: e.target.checked }))}
            onBlur={() => f.validate(field.target)}
            aria-describedby={`err-${field.target}`}
            aria-invalid={f.errors[field.target] ? true : undefined}
            className="mt-1.5 size-4 accent-ink"
          />
          {field.label}
        </label>
      )
    }

    if (field.control === 'radio' || field.control === 'checkboxGroup' || field.control === 'tags') {
      const multi = field.control !== 'radio'
      const current = f.values[field.target]
      const chosen = Array.isArray(current) ? current : []
      return (
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-3">
          {field.choices.map((c) => (
            <label key={c.value} className="flex cursor-pointer items-center gap-2.5 text-t-base">
              <input
                type={multi ? 'checkbox' : 'radio'}
                name={field.target}
                value={c.value}
                checked={multi ? chosen.includes(c.value) : current === c.value}
                onChange={(e) =>
                  f.setValues((v) => ({
                    ...v,
                    [field.target]: multi
                      ? e.target.checked
                        ? [...chosen, c.value]
                        : chosen.filter((x) => x !== c.value)
                      : c.value,
                  }))
                }
                onBlur={() => f.validate(field.target)}
                className="size-4 accent-ink"
              />
              {c.label}
            </label>
          ))}
        </div>
      )
    }

    const type = INPUT_TYPE[field.control]
    if (!type) {
      return <p className="mt-2 text-t-sm text-stone">This question can&rsquo;t be answered here yet.</p>
    }
    return (
      <input
        {...common}
        {...f.bind(field.target)}
        type={type}
        autoComplete={AUTOCOMPLETE[field.identifier]}
        min={field.validation.minDate ?? field.validation.minimum}
        max={field.validation.maxDate ?? field.validation.maximum}
        className={controlClass}
      />
    )
  }

  return (
    <form
      noValidate
      onSubmit={async (e) => {
        await f.submit(e)
      }}
      className="bg-mist p-[clamp(28px,4vw,56px)]"
    >
      <div className="grid grid-cols-2 gap-x-8 gap-y-4 bp-560:grid-cols-1">
        {fields.map((field) => {
          const grouped = ['radio', 'checkboxGroup', 'tags'].includes(field.control)
          return (
            <div
              key={field.target}
              role={grouped ? 'group' : undefined}
              aria-labelledby={grouped ? `label-${field.target}` : undefined}
              className={HALF_WIDTH.has(field.identifier) ? '' : 'col-span-full'}
            >
              {field.control !== 'checkbox' && (
                <span id={`label-${field.target}`} className="contents">
                  <FieldLabel field={field} form={form} htmlFor={grouped ? undefined : `field-${field.target}`} />
                </span>
              )}
              {renderControl(field)}
              {field.description && <p className="mt-2 text-[0.8125rem] leading-[1.5] text-stone">{field.description}</p>}
              <p id={`err-${field.target}`} className={errorClass}>
                {f.errors[field.target]}
              </p>
            </div>
          )
        })}
      </div>

      {f.errors[FORM_ERROR] && (
        <p role="alert" className="mt-6 text-t-sm text-rose-deep">
          {f.errors[FORM_ERROR]}
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-end gap-4 bp-560:[&>*]:w-full bp-560:[&>*]:justify-center">
        {f.step > 0 && (
          <button type="button" onClick={f.previous} className="text-link mt-0 mr-auto cursor-pointer">
            {form.previousText || 'Back'}
          </button>
        )}
        {last ? (
          <button type="submit" disabled={f.loading} className="cta cursor-pointer disabled:cursor-wait disabled:opacity-70">
            {f.loading ? 'Sending…' : form.submitText || 'Send'} <Icon icon={ChevronRight} size={16} />
          </button>
        ) : (
          <button type="button" onClick={() => f.next()} className="cta cursor-pointer">
            {form.nextText || 'Continue'} <Icon icon={ChevronRight} size={16} />
          </button>
        )}
      </div>
    </form>
  )
}
