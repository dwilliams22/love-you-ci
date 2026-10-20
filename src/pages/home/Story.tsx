export const Story = () => (
  <section
    className="relative isolate overflow-clip py-[clamp(110px,15vw,200px)] text-center text-paper"
    aria-label="About Ci's work"
  >
    <div
      className="story-bg absolute inset-x-0 -inset-y-[18%] z-[-1] [--py:90px]"
      data-parallax
      aria-hidden
    />
    <figure className="wrap">
      <blockquote className="mx-auto max-w-[38rem]">
        <p className="text-[clamp(1.125rem,1.7vw,1.3125rem)] leading-[1.8] tracking-[0.01em]">
          No matter what look you&rsquo;re going for, I can do it all. I offer a variety of services
          to enhance your natural beauty. I am creative, flexible, and able to adapt to a variety of
          events and styles. With years of experience, I have faced all kinds of requests, and
          making your vision come to life is of top priority. Take a look at my offerings, and
          schedule your appointment today!
        </p>
      </blockquote>
      <figcaption className="rose-gold-text mt-9 px-[0.2em] py-[0.1em] font-script text-[clamp(2.5rem,4vw,3.25rem)] leading-none">
        Ciara Latrice
      </figcaption>
    </figure>
  </section>
)
