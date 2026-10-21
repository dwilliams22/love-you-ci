const bodyClass = 'max-w-[36rem] text-t-lg leading-[1.8]'
// Italiana drop cap that opens Ci's story
const dropCapClass =
  'first-letter:float-left first-letter:mt-[0.06em] first-letter:mr-[0.12em] first-letter:font-display first-letter:text-[4.25em] first-letter:leading-[0.8] first-letter:text-rose-deep'

type AboutChapterProps = { label: string; text: string; dropCap?: boolean }

// One story row: the label on the left, Ci's paragraph on the right
export const AboutChapter = ({ label, text, dropCap = false }: AboutChapterProps) => (
  <li className="grid grid-cols-[minmax(0,13rem)_minmax(0,1fr)] gap-x-[clamp(32px,6vw,96px)] border-t border-(--hair) py-[clamp(40px,5vw,64px)] bp-860:grid-cols-1 bp-860:gap-y-5">
    {/* Top padding centres the label on the paragraph's first 36px line (desktop only, where they sit side by side) */}
    <h2 className="pt-[9px] text-[0.9375rem] leading-tight font-semibold tracking-[0.2em] text-ink uppercase bp-860:pt-0">
      {label}
    </h2>
    <p className={`${bodyClass} ${dropCap ? dropCapClass : ''}`}>{text}</p>
  </li>
)
