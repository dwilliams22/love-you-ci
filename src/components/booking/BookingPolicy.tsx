import {
  Bandage,
  CalendarClock,
  CalendarX,
  Clock,
  CreditCard,
  MapPin,
  PhoneOff,
  Plus,
  Sparkles,
  Store,
  Sunrise,
  UserX,
  Wallet,
} from 'lucide-react'
import selfie from '../../assets/selfie.jpg'
import {
  addOnPrices,
  businessHours,
  instagramHandle,
  keyNotes,
  policyRules,
  studioAddress,
  type PolicyRule,
} from '../../content/bookingPolicy'
import { InstagramIcon } from '../icons/InstagramIcon'
import { Icon, ICON_STROKE, type IconComponent } from '../ui/Icon'

const NOTE_ICONS: Record<(typeof keyNotes)[number]['id'], IconComponent> = {
  balance: Wallet,
  'books-open': CalendarClock,
  'off-hours': Sunrise,
}

const RULE_ICONS: Record<PolicyRule['id'], IconComponent> = {
  deposit: CreditCard,
  'on-time': Clock,
  cancellations: CalendarX,
  'no-guests': UserX,
  health: Bandage,
  phone: PhoneOff,
  'clean-face': Sparkles,
}

const eyebrow = 'text-[0.75rem] font-semibold tracking-[0.28em] text-rose-deep uppercase'
// Section and rule headings: the eyebrow's type, larger and in ink
const heading = 'text-[0.9375rem] leading-tight font-semibold tracking-[0.2em] text-ink uppercase'

const IconBadge = ({ icon, size = 'size-12' }: { icon: IconComponent; size?: string }) => (
  <span className={`grid ${size} shrink-0 place-items-center rounded-full border border-rose/60 text-rose-deep`}>
    <Icon icon={icon} size={20} />
  </span>
)

export const BookingPolicy = () => (
  <div className="mt-[clamp(48px,6vw,80px)] flex flex-col gap-[clamp(56px,7vw,96px)]">
    {/* Hours, studio, add-ons */}
    <div className="grid grid-cols-3 gap-[clamp(32px,4vw,64px)] border-y border-(--hair) py-[clamp(32px,4vw,48px)] bp-860:grid-cols-1">
      <section aria-labelledby="hours-heading">
        <div className="flex items-center gap-3">
          <IconBadge icon={Store} size="size-10" />
          <h2 id="hours-heading" className={heading}>
            Business hours
          </h2>
        </div>
        <dl className="mt-5 flex flex-col gap-2.5 text-[0.9375rem]">
          {businessHours.map((row) => (
            <div key={row.days} className="flex justify-between gap-4 border-b border-(--hair) pb-2.5 last:border-b-0">
              <dt>{row.days}</dt>
              <dd className={`font-normal ${row.hours === 'Closed' ? 'text-stone' : ''}`}>{row.hours}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="studio-heading">
        <div className="flex items-center gap-3">
          <IconBadge icon={MapPin} size="size-10" />
          <h2 id="studio-heading" className={heading}>
            Studio
          </h2>
        </div>
        <address className="mt-5 text-t-lg leading-[1.5] not-italic">
          {studioAddress.street}
          <br />
          {studioAddress.cityLine}
        </address>
        <p className="mt-2 text-t-sm leading-[1.6] text-stone">{studioAddress.note}</p>
      </section>

      <section aria-labelledby="addons-heading">
        <div className="flex items-center gap-3">
          <IconBadge icon={Plus} size="size-10" />
          <h2 id="addons-heading" className={heading}>
            Add onto any makeup service
          </h2>
        </div>
        <dl className="mt-5 flex flex-col gap-2.5 text-[0.9375rem]">
          {addOnPrices.map((a) => (
            <div key={a.name} className="flex justify-between gap-4 border-b border-(--hair) pb-2.5 last:border-b-0">
              <dt>{a.name}</dt>
              <dd className="font-normal text-rose-deep tabular-nums">{a.price}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>

    {/* Booking policy */}
    <section aria-labelledby="policy-heading">
      <div className="relative text-center">
        <p className={eyebrow}>Please read before booking</p>
        <h2 id="policy-heading" className="mt-4 font-display text-t-2xl leading-none">
          Booking Policy
        </h2>
      </div>
      <ol className="mt-[clamp(32px,4vw,56px)] grid grid-cols-2 gap-x-[clamp(32px,5vw,80px)] gap-y-10 bp-860:grid-cols-1">
        {policyRules.map((rule) => (
          <li key={rule.id} className="flex gap-5">
            <IconBadge icon={RULE_ICONS[rule.id]} />
            <div>
              <h3 className={`${heading} flex min-h-12 items-center`}>{rule.title}</h3>
              <p className="mt-1 text-[0.9375rem] leading-[1.65] text-stone">
                {rule.body.map((part, i) =>
                  part.emphasis ? (
                    <strong key={i} className="font-medium text-ink">
                      {part.text}
                    </strong>
                  ) : (
                    part.text
                  ),
                )}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>

    {/* Highlighted notes */}
    <ul className="grid grid-cols-3 gap-px bg-(--hair) bp-860:grid-cols-1" aria-label="Before you book">
      {keyNotes.map((note) => (
        <li key={note.id} className="flex gap-4 bg-mist p-[clamp(20px,2.5vw,32px)]">
          <IconBadge icon={NOTE_ICONS[note.id]} size="size-11" />
          <div>
            <p className={`${heading} flex min-h-11 items-center`}>{note.title}</p>
            <p className="mt-1 text-t-sm leading-[1.6] text-stone">{note.text}</p>
          </div>
        </li>
      ))}
    </ul>

    {/* Selfies: a full-bleed mist band that echoes the landing page (ghost word + taped photo) */}
    <section
      aria-labelledby="selfies-heading"
      className="relative isolate mx-[calc(50%-50vw)] overflow-clip bg-mist py-[clamp(72px,9vw,128px)]"
    >
      <span
        className="pointer-events-none absolute -right-[0.04em] -bottom-[0.2em] -z-10 font-display text-t-ghost leading-none text-paper select-none [--px:-60px]"
        data-parallax
        aria-hidden
      >
        Selfies
      </span>
      <div className="wrap grid grid-cols-[auto_minmax(0,1fr)] items-center gap-[clamp(48px,8vw,128px)] bp-560:grid-cols-1 bp-560:justify-items-center bp-560:text-center">
        {/* Polaroid proportions: square photo, thin even sides/top, deep bottom strip */}
        <figure className="taped tape-rose w-(--w) bg-paper px-[6%] pt-[6%] pb-[calc(var(--w)*0.28)] [--w:clamp(230px,22vw,300px)] [transform:rotate(-3deg)] [--tape-rot:4deg] bp-560:order-2">
          <img
            src={selfie}
            alt="A client's glam selfie: soft pink eyeshadow, full lashes, glowing highlight and a glossy pink lip"
            width={800}
            height={800}
            loading="lazy"
            className="aspect-square w-full object-cover"
          />
        </figure>
        <div className="max-w-[30rem]">
          <h2 id="selfies-heading" className="font-display text-t-xl tracking-[0.06em]">
            TAG US IN YOUR
            <span className="rose-gold-text block w-fit text-t-2xl leading-[1.15] bp-560:mx-auto">
              Selfies!
            </span>
          </h2>
          <p className="mt-2 text-t-lg leading-[1.55] text-stone">
            We love seeing your final looks. Tag us on Instagram @{instagramHandle} to be featured!
          </p>
          <a
            href={`https://www.instagram.com/${instagramHandle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex min-h-12 items-center gap-2.5 border border-ink px-7 text-[0.9375rem] font-medium tracking-[0.04em] transition-[background,color] duration-300 hover:bg-ink hover:text-paper"
          >
            <InstagramIcon size={18} strokeWidth={ICON_STROKE} />
            Follow Us
          </a>
        </div>
      </div>
    </section>
  </div>
)
