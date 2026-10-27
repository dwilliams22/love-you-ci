import { Cta } from '../../components/ui/Cta'

// Landing page after Wix checkout. Arriving here is not proof of payment,
// so the copy points to the confirmation email rather than claiming success.
export const ShopThankYouPage = () => (
  <main className="wrap py-[clamp(80px,10vw,140px)]">
    <title>Thank You | Love You, Ci</title>
    <div className="mx-auto max-w-[36rem] text-center">
      <p className="mb-4 text-[0.75rem] font-semibold tracking-[0.42em] text-rose-deep">LOVE YOU, CI</p>
      <h1 className="font-display text-t-2xl leading-none">Thank You</h1>
      <p className="mt-8 text-t-lg leading-[1.55] text-stone">
        Once your payment goes through, your order confirmation will arrive by email with all the details.
      </p>
      <p className="mt-4 text-t-base text-stone">
        Didn&rsquo;t receive it? Check your spam folder, or reach out through the contact page.
      </p>
      <p className="rose-gold-text mt-[calc(2.5rem-0.15em)] -mb-[0.3em] px-[0.15em] pt-[0.15em] pb-[0.3em] font-script text-[clamp(2.5rem,4vw,3.25rem)] leading-none">Love You, Ci</p>
      <div className="mt-12 flex flex-wrap justify-center gap-4">
        <Cta to="/shop">Back to shop</Cta>
      </div>
    </div>
  </main>
)
