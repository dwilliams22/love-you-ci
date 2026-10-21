import { ContactForm } from '../components/contact/ContactForm'
import { SocialLinks } from '../components/ui/SocialLinks'
import {
  CONTACT_FORM_ID,
  contactEmail,
  contactHeading,
  contactIntro,
  contactPhone,
  contactSocialLabel,
} from '../content/contact'

const detailLabel = 'text-[0.75rem] font-semibold tracking-[0.32em] text-rose-deep uppercase'
const detailLink =
  'mt-3 inline-block text-t-lg font-normal underline decoration-(--hair) decoration-1 underline-offset-[6px] [transition:color_0.3s,text-decoration-color_0.3s] hover:text-rose-deep hover:decoration-rose'

export const ContactPage = () => (
  <main className="py-[clamp(64px,8vw,112px)]">
    <title>Contact Ci | Love You, Ci</title>
    <div className="wrap grid grid-cols-[minmax(0,5fr)_minmax(0,7fr)] items-start gap-x-[clamp(40px,6vw,104px)] gap-y-14 bp-1080:grid-cols-1">
      <header>
        <p className="mb-4 text-[0.75rem] font-semibold tracking-[0.42em] text-rose-deep">CONTACT CI</p>
        <h1 className="font-display text-t-2xl leading-none">{contactHeading}</h1>
        <p className="mt-6 max-w-[28rem] text-t-lg leading-[1.55] text-pretty text-stone">{contactIntro}</p>

        <dl className="mt-[clamp(40px,5vw,56px)] border-t border-(--hair) bp-1080:flex bp-1080:flex-wrap bp-1080:gap-x-[clamp(40px,7vw,88px)] bp-1080:border-b bp-560:block bp-560:border-b-0">
          <div className="border-b border-(--hair) py-6 bp-1080:border-b-0 bp-560:border-b">
            <dt className={detailLabel}>{contactPhone.label}</dt>
            <dd>
              <a href={contactPhone.href} className={detailLink}>
                {contactPhone.display}
              </a>
            </dd>
          </div>
          <div className="border-b border-(--hair) py-6 bp-1080:border-b-0 bp-560:border-b">
            <dt className={detailLabel}>{contactEmail.label}</dt>
            <dd>
              <a href={`mailto:${contactEmail.address}`} className={`${detailLink} break-all`}>
                {contactEmail.address}
              </a>
            </dd>
          </div>
          <div className="py-6">
            <dt className={detailLabel}>{contactSocialLabel}</dt>
            <dd>
              <SocialLinks className="mt-4" />
            </dd>
          </div>
        </dl>
      </header>

      <section aria-label="Send Ci a message">
        <ContactForm formId={CONTACT_FORM_ID} />
      </section>
    </div>
  </main>
)
