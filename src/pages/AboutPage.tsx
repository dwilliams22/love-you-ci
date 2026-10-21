import photo from '../assets/about-ci.jpg'
import { aboutClosing, aboutIntro, aboutJourney, aboutPromise, aboutStamp } from '../content/about'

const bodyClass = 'mx-auto max-w-[36rem] text-t-lg leading-[1.8]'

export const AboutPage = () => (
  <main>
    <title>About Ci | Love You, Ci</title>

    {/* Studio portrait that darkens into ink under the title, as on Ci's About graphic */}
    <section className="relative isolate overflow-clip bg-mist" aria-labelledby="about-title">
      <div className="hero-rise mx-auto w-[min(100%,620px,calc((100svh_-_var(--bar))*0.638))] bp-560:w-full">
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
      <h1
        id="about-title"
        className="hero-rise absolute inset-x-0 bottom-[clamp(28px,5vw,64px)] flex items-end justify-center font-display text-[clamp(3.25rem,9vw,7.5rem)] leading-none font-normal text-paper uppercase"
        style={{ '--i': 1 }}
      >
        <span className="tracking-[0.12em]">About</span>{' '}
        <span className="rose-gold-text -ml-[0.32em] -mb-[0.12em] px-[0.25em] py-[0.15em] font-script text-[1.5em] normal-case">
          Ci
        </span>
      </h1>
    </section>

    <section className="bg-ink pb-[clamp(56px,8vw,104px)] text-center text-paper" aria-label="Hi Loves">
      <p
        className="wrap hero-rise mx-auto max-w-[44rem] pt-[clamp(32px,4vw,48px)] font-display text-t-xl leading-[1.55]"
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
