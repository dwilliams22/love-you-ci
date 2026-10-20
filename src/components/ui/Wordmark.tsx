import { Link } from 'react-router'

export const Wordmark = () => (
  <Link
    to="/"
    aria-label="Love You, Ci Makeup Artistry, home"
    className="grid shrink-0 justify-items-center leading-none"
  >
    <b className="font-display text-[1.75rem] font-normal tracking-[0.02em] bp-560:text-[1.5rem]">
      LOVE YOU, CI
    </b>
    <small className="mt-[3px] -mr-[0.34em] text-[0.5625rem] font-semibold tracking-[0.34em]">
      MAKEUP ARTISTRY
    </small>
  </Link>
)
