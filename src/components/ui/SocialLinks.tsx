import { socialLinks } from '../../config/nav'
import { InstagramIcon } from '../icons/InstagramIcon'
import { YoutubeIcon } from '../icons/YoutubeIcon'
import { ICON_STROKE } from './Icon'

type SocialLinksProps = {
  onDark?: boolean
  className?: string
}

export const SocialLinks = ({ onDark = false, className = '' }: SocialLinksProps) => {
  const linkClass = `grid size-11 place-items-center rounded-[50%] border ${
    onDark ? 'border-(--hair-light)' : 'border-(--hair)'
  } text-[1.25rem] [transition:border-color_0.3s,color_0.3s] hover:border-rose hover:text-rose`

  return (
    <div className={`flex gap-3 ${className}`}>
      <a
        href={socialLinks.instagram}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Love You, Ci on Instagram"
        className={linkClass}
      >
        <InstagramIcon size={20} strokeWidth={ICON_STROKE} />
      </a>
      <a
        href={socialLinks.youtube}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Love You, Ci on YouTube"
        className={linkClass}
      >
        <YoutubeIcon size={20} strokeWidth={ICON_STROKE} />
      </a>
    </div>
  )
}
