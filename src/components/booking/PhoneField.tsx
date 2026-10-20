import { useState } from 'react'
import {
  AsYouType,
  getCountries,
  getCountryCallingCode,
  parsePhoneNumberFromString,
  type CountryCode,
} from 'libphonenumber-js'
import { ChevronDown } from 'lucide-react'
import { Icon } from '../ui/Icon'

const DEFAULT_COUNTRY: CountryCode = 'US'

const regionNames = new Intl.DisplayNames(['en'], { type: 'region' })

// Regional-indicator emoji flag from a 2-letter country code
const flagOf = (country: CountryCode) =>
  String.fromCodePoint(...[...country].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65))

// US first, then the rest alphabetically by English name
const COUNTRIES = [
  DEFAULT_COUNTRY,
  ...getCountries()
    .filter((c) => c !== DEFAULT_COUNTRY)
    .sort((a, b) => (regionNames.of(a) ?? a).localeCompare(regionNames.of(b) ?? b)),
]

type PhoneFieldProps = {
  id: string
  value: string
  required: boolean
  describedBy?: string
  inputClassName: string
  // Receives the E.164 number (+15551234567) when valid, '' otherwise, so Book stays gated
  onChange: (e164: string) => void
}

export const PhoneField = ({ id, value, required, describedBy, inputClassName, onChange }: PhoneFieldProps) => {
  // Restore a number already in the flow (e.g. coming back from "Change date & time")
  const [initial] = useState(() => parsePhoneNumberFromString(value))
  const [country, setCountry] = useState<CountryCode>(initial?.country ?? DEFAULT_COUNTRY)
  const [national, setNational] = useState(initial ? initial.formatNational() : '')
  const [touched, setTouched] = useState(false)

  const parsed = parsePhoneNumberFromString(national, country)
  const valid = !!parsed?.isValid()
  const showError = touched && national.trim() !== '' && !valid
  const errorId = `${id}-error`

  const update = (nextNational: string, nextCountry: CountryCode) => {
    const p = parsePhoneNumberFromString(nextNational, nextCountry)
    onChange(p?.isValid() ? p.number : '')
  }

  return (
    <div>
      <div className="mt-2 flex">
        <div className="relative flex shrink-0 items-center gap-1.5 border border-r-0 border-(--hair) bg-paper px-3 text-t-base font-normal focus-within:border-ink">
          <span aria-hidden>{flagOf(country)}</span>
          <span aria-hidden>+{getCountryCallingCode(country)}</span>
          <Icon icon={ChevronDown} size={14} className="text-stone" />
          {/* Native select keeps keyboard type-ahead and screen reader support; the span above is its face */}
          <select
            aria-label="Country code"
            className="absolute inset-0 cursor-pointer opacity-0"
            value={country}
            onChange={(e) => {
              const next = e.target.value as CountryCode
              setCountry(next)
              setNational(new AsYouType(next).input(national.replace(/\D/g, '')))
              update(national, next)
            }}
          >
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {`${flagOf(c)} ${regionNames.of(c) ?? c} +${getCountryCallingCode(c)}`}
              </option>
            ))}
          </select>
        </div>
        <input
          id={id}
          type="tel"
          autoComplete="tel-national"
          inputMode="tel"
          className={`${inputClassName} min-w-0 flex-1`}
          required={required}
          aria-invalid={showError}
          aria-describedby={[describedBy, showError ? errorId : ''].filter(Boolean).join(' ') || undefined}
          value={national}
          onBlur={() => setTouched(true)}
          onChange={(e) => {
            // Format as you type, but let backspace remove formatting characters
            const raw = e.target.value
            const next = raw.length < national.length ? raw : new AsYouType(country).input(raw)
            setNational(next)
            update(next, country)
          }}
        />
      </div>
      {showError && (
        <p id={errorId} className="mt-1.5 text-[0.8125rem] text-rose-deep">
          Enter a valid {regionNames.of(country)} phone number.
        </p>
      )}
    </div>
  )
}
