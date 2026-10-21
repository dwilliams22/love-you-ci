import photo from '../assets/about-ci.jpg'
import { aboutClosing, aboutIntro, aboutJourney, aboutPromise, aboutStamp } from '../content/about'

const bodyClass = 'mx-auto max-w-[36rem] text-t-lg leading-[1.8]'

export const AboutPage = () => (
  // --title: heading size; the portrait leaves room for it so the whole title fits the first screen
  <main className="[--title:clamp(5rem,24vw,16.5rem)]">
    <title>About Ci | Love You, Ci</title>

    {/* Studio portrait that darkens into ink, as on Ci's About graphic */}
    <div className="relative isolate overflow-clip bg-mist">
      <div className="hero-rise mx-auto w-[min(100%,620px,calc((100svh_-_var(--bar)_-_var(--title)*0.9)*0.638))]">
        <img
          src={photo}
          alt="Ci seated in a makeup chair, holding a brush"
          width={1200}
          height={1880}
          className="about-photo block h-auto w-full [--py:48px]"
          data-parallax
        />
      </div>
      <div className="about-fade absolute inset-0" aria-hidden />
    </div>

    {/* flow-root keeps the heading's negative margin inside the band; z-index lifts it over the portrait */}
    <section className="relative z-[1] flow-root bg-ink pb-[clamp(56px,8vw,104px)] text-center text-paper" aria-labelledby="about-title">
      {/* Giant word rising out of the ink like the portrait, signed across its faded lower half with a rose-gold "Ci" */}
      <h1
        id="about-title"
        className="hero-rise relative -mt-[0.62em] pb-[0.62em] font-display text-(length:--title) leading-[0.8] font-normal"
        style={{ '--i': 1 }}
      >
        <span className="relative inline-block">
          <span className="about-word inline-block pl-[0.06em] tracking-[0.06em] uppercase">About</span>{' '}
          <span className="about-ci absolute top-[0.2em] left-1/2 -translate-x-1/2 px-[0.25em] py-[0.15em] font-script text-[1.05em] leading-none">
            Ci
          </span>
        </span>
      </h1>
      <p
        className="wrap hero-rise mx-auto max-w-[44rem] pt-[clamp(16px,2vw,32px)] font-display text-t-xl leading-[1.55]"
        style={{ '--i': 2 }}
      >
        {aboutIntro}
      </p>
    </section>

    {/* The light gradient again, in reverse: ink back to paper */}
    <div className="h-[clamp(120px,16vw,220px)] about-unfade" aria-hidden />

    <article className="relative overflow-clip pt-[clamp(24px,4vw,56px)] pb-[clamp(96px,13vw,180px)]" aria-label="Ci's story">
      <div className="wrap">
        {aboutJourney.map((text) => (
          <p key={text.slice(0, 24)} className={`${bodyClass} mb-8`}>
            {text}
          </p>
        ))}
      </div>

      <figure className="relative isolate my-[clamp(40px,6vw,88px)] py-[clamp(40px,6vw,80px)]">
        <span
          className="pointer-events-none absolute top-1/2 left-1/2 -z-10 -translate-1/2 font-display text-t-ghost leading-[0.8] whitespace-nowrap text-mist select-none [--px:-90px]"
          data-parallax
          aria-hidden
        >
          LOVE YOU
        </span>
        <blockquote className="wrap mx-auto max-w-[46rem] text-center">
          <p className="font-display text-t-xl leading-[1.55]">{aboutStamp}</p>
        </blockquote>
      </figure>

      <div className="wrap">
        <p className={bodyClass}>{aboutPromise}</p>
        <div className="mx-auto mt-[clamp(56px,7vw,88px)] max-w-[36rem] border-t border-(--hair) pt-[clamp(48px,6vw,72px)] text-center">
          <p className="font-display text-t-xl leading-[1.55]">{aboutClosing}</p>
          <p className="rose-gold-text mx-auto mt-8 w-fit px-[0.2em] py-[0.1em] font-script text-[clamp(2.5rem,4vw,3.25rem)] leading-none">
            Ciara Latrice
          </p>
        </div>
      </div>
    </article>
  </main>
)
