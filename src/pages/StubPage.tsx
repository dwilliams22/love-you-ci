type StubPageProps = {
  title: string
}

// Placeholder until the page's real content is built
export const StubPage = ({ title }: StubPageProps) => (
  <main className="wrap py-[clamp(80px,10vw,140px)]">
    <title>{`${title} | Love You, Ci`}</title>
    <h1 className="font-display text-t-2xl leading-none font-normal">{title}</h1>
  </main>
)
