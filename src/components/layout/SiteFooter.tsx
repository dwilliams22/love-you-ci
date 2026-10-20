import { Link } from 'react-router'
import { navItems, socialLinks } from '../../config/nav'
import logo from '../../assets/love-you-ci-logo.png'
import { InstagramIcon } from '../icons/InstagramIcon'
import { YoutubeIcon } from '../icons/YoutubeIcon'
import { Cta } from '../ui/Cta'
import { ICON_STROKE } from '../ui/Icon'

const socialClass =
  'grid size-11 place-items-center rounded-[50%] border border-(--hair-light) text-[1.25rem] [transition:border-color_0.3s,color_0.3s] hover:border-rose hover:text-rose'

export const SiteFooter = () => (
  <footer className="bg-ink pt-[clamp(80px,10vw,120px)] pb-8 text-center text-paper" id="contact">
    <div className="wrap">
      <img
        className="mx-auto mb-9 h-auto w-[clamp(180px,20vw,240px)]"
        src={logo}
        alt="Love You, Ci"
        width={440}
        height={430}
      />
      <p className="mb-8 italic tracking-[0.04em] text-stone-light">
        Beauty from the inside out, love what you see
      </p>
      <Cta to="/book" light>
        Book Now
      </Cta>

      <ul className="mt-[72px] mb-10 flex flex-wrap justify-center gap-x-7 gap-y-3 border-t border-(--hair-light) pt-7 text-[0.9375rem]">
        {navItems.map((item) => (
          <li key={item.to}>
            <Link to={item.to} className="hover:text-rose">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
      <div className="mb-5 flex justify-center gap-3">
        <a
          href={socialLinks.instagram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Love You, Ci on Instagram"
          className={socialClass}
        >
          <InstagramIcon size={20} strokeWidth={ICON_STROKE} />
        </a>
        <a
          href={socialLinks.youtube}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Love You, Ci on YouTube"
          className={socialClass}
        >
          <YoutubeIcon size={20} strokeWidth={ICON_STROKE} />
        </a>
      </div>
      <p className="text-[0.8125rem] text-stone-light">
        &copy; <span>{new Date().getFullYear()}</span> by Love You, Ci.
      </p>
    </div>
  </footer>
)
