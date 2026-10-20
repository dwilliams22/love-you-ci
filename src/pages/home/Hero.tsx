import { Cta } from '../../components/ui/Cta'
import { PhotoSlot } from '../../components/ui/PhotoSlot'

export const Hero = () => (
  <section
    className="grid min-h-[calc(100dvh_-_var(--bar))] grid-cols-[minmax(0,1fr)_minmax(0,1fr)] bp-860:min-h-0 bp-860:grid-cols-1"
    aria-labelledby="hero-title"
  >
    <div className="flex flex-col items-start justify-center py-[clamp(48px,7vw,96px)] pr-(--gutter) pl-(--edge) bp-860:pt-14 bp-860:pb-12 bp-860:pl-(--gutter)">
      <h1
        className="hero-rise mb-7 grid justify-items-start text-[2em] leading-none font-normal"
        id="hero-title"
        style={{ '--i': 0 }}
      >
        <span className="font-display text-[clamp(3rem,5.4vw,5.25rem)] tracking-[0.01em] whitespace-nowrap">
          LOVE YOU, CI
        </span>
        <span className="mt-[0.9em] pl-[0.2em] font-body text-[clamp(0.75rem,1vw,0.9375rem)] font-semibold tracking-[0.42em] text-rose-deep">
          MAKEUP ARTISTRY
        </span>
      </h1>
      <p
        className="hero-rise mb-10 font-display text-[clamp(1.375rem,2.1vw,1.875rem)] leading-[1.3] text-stone"
        style={{ '--i': 1 }}
      >
        Beauty from the inside out,
        <br />
        love what you see.
      </p>
      <Cta to="/book" className="hero-rise" style={{ '--i': 2 }}>
        Book Now
      </Cta>
    </div>
    <div className="relative grid place-items-center overflow-clip bg-mist px-(--gutter) py-[clamp(56px,7vw,96px)] bp-860:pt-16 bp-860:pb-[72px]">
      <span
        className="pointer-events-none absolute -right-[0.06em] -bottom-[0.18em] font-display text-[clamp(9rem,20vw,18rem)] leading-none text-paper select-none [--px:-40px]"
        data-parallax
        aria-hidden
      >
        Ci
      </span>
      <div className="hero-photo taped tape-rose aspect-[4/5] w-[min(100%,440px)] [transform:rotate(1.5deg)] [--py:-28px] [--tape-rot:-3deg] bp-860:w-[min(78%,380px)]">
        {/* REPLACE: hero portrait of Ci, 4:5 (e.g. 1200x1500) */}
        <PhotoSlot label="Photo 1: Ci portrait" className="size-full" parallax />
      </div>
    </div>
  </section>
)
