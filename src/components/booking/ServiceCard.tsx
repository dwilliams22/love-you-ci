import { Link } from 'react-router'
import { ChevronRight, Image } from 'lucide-react'
import { imgAttrs } from '../../wix/media'
import type { ServiceSummary } from '../../wix/bookings/types'
import { Icon } from '../ui/Icon'
import { depositLabel, metaLine, offeredDaysLabel } from './serviceMeta'

type ServiceCardProps = {
  service: ServiceSummary
  index: number
  // Intercepts a plain click (e.g. to open the add-ons modal); modified clicks still follow the link
  onBook?: () => void
}

// Alternating tilt + tape angle, like the landing page's Our Looks cards
const tiltClass = (index: number) =>
  index % 2 ? '[transform:rotate(1deg)] [--tape-rot:-3deg]' : '[transform:rotate(-1.2deg)] [--tape-rot:2deg]'

export const ServiceCard = ({ service, index, onBook }: ServiceCardProps) => (
  <li className="group relative flex flex-col">
    <div className={`taped tape-rose aspect-[4/5] ${tiltClass(index)}`}>
      <div className="slot h-full">
        <span>
          <Icon icon={Image} size={14} />
          {service.name}
        </span>
        {service.imageUrl && <img {...imgAttrs(service.imageUrl, '(max-width: 560px) 90vw, 33vw', 5 / 4)} alt="" />}
      </div>
    </div>
    <div className="mt-7 flex flex-1 flex-col">
      {service.type === 'CLASS' && (
        <p className="mb-2 text-[0.75rem] font-semibold tracking-[0.28em] text-rose-deep uppercase">
          Class{service.offeredDays.length > 0 && ` · ${offeredDaysLabel(service.offeredDays)}`}
        </p>
      )}
      <h2 className="text-t-lg leading-tight font-semibold tracking-[0.2em] uppercase">
        {/* Stretched link: the whole card is clickable */}
        <Link
          to={`/book/${service.slug}`}
          className="after:absolute after:inset-0"
          onClick={(e) => {
            if (!onBook || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
            e.preventDefault()
            onBook()
          }}
        >
          {service.name}
        </Link>
      </h2>
      {service.tagLine && <p className="mt-2 line-clamp-3 text-t-sm leading-[1.6] text-stone">{service.tagLine}</p>}
      <p className="mt-4 text-[0.9375rem] font-normal tracking-[0.02em]">
        {metaLine(service)}
        {depositLabel(service) && <span className="text-stone"> · {depositLabel(service)}</span>}
      </p>
      <span className="text-link mt-4 self-start group-hover:bg-[length:40%_1px] group-hover:text-rose-deep" aria-hidden>
        Book <Icon icon={ChevronRight} size={15} />
      </span>
    </div>
  </li>
)

export const ServiceCardSkeleton = () => (
  <li className="flex flex-col" aria-hidden>
    <div className="taped aspect-[4/5]">
      <div className="slot h-full animate-pulse" />
    </div>
    <div className="mt-7 h-7 w-2/3 animate-pulse bg-mist" />
    <div className="mt-3 h-4 w-full animate-pulse bg-mist" />
    <div className="mt-2 h-4 w-4/5 animate-pulse bg-mist" />
  </li>
)
