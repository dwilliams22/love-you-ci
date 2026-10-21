import meetPhoto from '../../assets/meet-ci.jpg'
import signature from '../../assets/ci-signature.png'
import { PhotoSlot } from '../../components/ui/PhotoSlot'
import { TextLink } from '../../components/ui/TextLink'

const ghostClass = 'font-display text-t-ghost leading-[0.8] text-mist whitespace-nowrap'

export const MeetCi = () => (
  <section className="relative overflow-clip py-[clamp(96px,13vw,180px)]" id="meet" aria-labelledby="meet-title">
    <div
      className="pointer-events-none absolute inset-0 flex flex-col justify-between py-[clamp(20px,3vw,40px)] select-none"
      aria-hidden
    >
      <span className={`${ghostClass} pl-[4vw] [--px:90px]`} data-parallax>
        MEET
      </span>
      <span className={`${ghostClass} self-end pr-[6vw] [--px:-90px]`} data-parallax>
        LOVE YOU
      </span>
    </div>
    <div className="wrap relative grid grid-cols-[minmax(0,5fr)_minmax(0,6fr)] items-center gap-[clamp(48px,7vw,120px)] bp-860:grid-cols-1">
      <div className="relative w-[min(100%,420px)] justify-self-end pb-[12%] bp-860:w-[min(80%,360px)] bp-860:justify-self-center bp-860:pb-0">
        <div className="taped tape-rose aspect-[3/4] [transform:rotate(-2deg)] [--tape-rot:3deg]">
          <PhotoSlot
            label="Photo 2: Meet Ci"
            className="h-full"
            photo={{
              src: meetPhoto,
              alt: 'Ci smiling in a black blazer, holding up a makeup brush',
              width: 1200,
              height: 1600,
            }}
          />
        </div>
      </div>
      <div className="max-w-[30rem] bp-860:justify-self-center">
        <h2
          className="mb-7 flex items-end gap-1 font-body text-t-2xl leading-none font-normal"
          id="meet-title"
        >
          Meet{' '}
          <img
            src={signature}
            alt="Ci"
            width={374}
            height={336}
            className="-mb-[0.32em] h-auto w-[clamp(110px,12vw,160px)] bp-560:w-[104px]"
          />
        </h2>
        <p className="mb-3.5 text-t-xl leading-[1.55]">
          Hi, I am Ci, your personal Makeup Artist.
        </p>
        <p className="mb-3.5 text-t-lg leading-[1.55]">
          Welcome to my world of beauty, where I create the &ldquo;Love you, Ci.&rdquo;
        </p>
        <TextLink to="/portfolio">Portfolio</TextLink>
      </div>
    </div>
  </section>
)
