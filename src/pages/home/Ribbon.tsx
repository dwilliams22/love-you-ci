import { Fragment } from 'react'
import { Heart } from 'lucide-react'
import { Icon } from '../../components/ui/Icon'

const phrases = [
  'Beauty from the inside out, love what you see',
  'Love You, Ci Makeup Artistry',
  'Beauty from the inside out, love what you see',
  'Love You, Ci Makeup Artistry',
]

// Two identical runs so the -50% marquee loops seamlessly
export const Ribbon = () => (
  <div className="overflow-clip border-t border-(--hair-light) bg-ink py-3.5 text-paper" aria-hidden>
    <div className="ribbon-track">
      {[0, 1].map((run) => (
        <span
          key={run}
          className="inline-flex items-center gap-7 pr-7 text-t-sm tracking-[0.08em] whitespace-nowrap"
        >
          {phrases.map((phrase, i) => (
            <Fragment key={i}>
              {phrase}
              <Icon icon={Heart} size={14} className="text-rose" />
            </Fragment>
          ))}
        </span>
      ))}
    </div>
  </div>
)
