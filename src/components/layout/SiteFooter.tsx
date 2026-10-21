import { NavLink } from 'react-router'
import { navItems, socialLinks } from '../../config/nav'
import logo from '../../assets/love-you-ci-logo.png'
import { InstagramIcon } from '../icons/InstagramIcon'
import { YoutubeIcon } from '../icons/YoutubeIcon'
import { Cta } from '../ui/Cta'
import { ICON_STROKE } from '../ui/Icon'

const socialClass =
  'grid size-11 place-items-center rounded-[50%] border border-(--hair-light) text-[1.25rem] [transition:border-color_0.3s,color_0.3s] hover:border-rose hover:text-rose'

export const SiteFooter = () => (
  <footer className="bg-ink pt-[clamp(56px,7vw,88px)] pb-7 text-center text-paper" id="contact">
    <div className="wrap">
      <img
        className="mx-auto mb-6 h-auto w-[clamp(150px,14vw,190px)]"
        src={logo}
        alt="Love You, Ci"
        width={440}
        height={430}
      />
      <p className="mb-7 italic tracking-[0.04em] text-balance text-stone-light">
        Beauty from the inside out, love what you see
      </p>
      <Cta to="/book" light>
        Book Now
      </Cta>

      <nav aria-label="Footer" className="mt-[clamp(48px,6vw,64px)] border-t border-(--hair-light) pt-7">
        <ul className="flex flex-wrap justify-center gap-x-7 gap-y-3 text-[0.9375rem] bp-560:gap-x-5">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className="[transition:color_0.3s] hover:text-rose aria-[current=page]:text-rose"
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
        <div className="flex gap-3">
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
        <span aria-hidden="true" className="h-5 w-px bg-(--hair-light)" />
        <p className="text-[0.8125rem] text-stone-light">
          &copy; <span>{new Date().getFullYear()}</span> by Love You, Ci.
        </p>
      </div>
    </div>
  </footer>
)
