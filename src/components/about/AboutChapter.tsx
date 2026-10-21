const bodyClass = 'max-w-[36rem] text-t-lg leading-[1.8]'
// Italiana drop cap that opens Ci's story
const dropCapClass =
  'first-letter:float-left first-letter:mt-[0.06em] first-letter:mr-[0.12em] first-letter:font-display first-letter:text-[4.25em] first-letter:leading-[0.8] first-letter:text-rose-deep'

type AboutChapterProps = { number: number; label: string; text: string; dropCap?: boolean }

// One story row: rose-gold number and label on the left, Ci's paragraph on the right
export const AboutChapter = ({ number, label, text, dropCap = false }: AboutChapterProps) => (
  <li className="grid grid-cols-[minmax(0,13rem)_minmax(0,1fr)] gap-x-[clamp(32px,6vw,96px)] border-t border-(--hair) py-[clamp(40px,5vw,64px)] bp-860:grid-cols-1 bp-860:gap-y-5">
    <div className="flex flex-col gap-4 bp-860:flex-row bp-860:items-center bp-860:gap-5">
      <span className="rose-gold-text w-fit pr-[0.1em] font-display text-[clamp(2.75rem,4.4vw,3.75rem)] leading-none" aria-hidden>
        {String(number).padStart(2, '0')}
      </span>
      <h2 className="text-[0.9375rem] leading-tight font-semibold tracking-[0.2em] text-ink uppercase">{label}</h2>
    </div>
    <p className={`${bodyClass} ${dropCap ? dropCapClass : ''}`}>{text}</p>
  </li>
)
