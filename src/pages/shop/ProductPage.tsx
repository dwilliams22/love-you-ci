import { useEffect, useRef, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router'
import { ChevronLeft, ChevronRight, Minus, Plus } from 'lucide-react'
import { ProductPrice } from '../../components/shop/ProductPrice'
import OptionPicker from '../../components/storefront/OptionPicker'
import { Icon } from '../../components/ui/Icon'
import { useProductDetail } from '../../hooks/storefront/useProductDetail'
import { imgAttrs } from '../../wix/media'
import { fetchProducts } from '../../wix/storefront/catalog'
import type { ProductSummary } from '../../wix/storefront/types'

// Product page, laid out like Ci's Wix product page: breadcrumb + prev/next, gallery with
// thumbnails and the description on the left, name, price, options, quantity, add to cart and
// the info sections on the right. The picked variant is mirrored in ?variantId= so a shade is shareable.
export const ProductPage = () => {
  const { slug = '' } = useParams()
  // One product-detail store per mount: remount to switch products
  return <ProductView key={slug} slug={slug} />
}

const richText =
  'leading-[1.75] [&_a]:underline [&_li]:mb-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_p:not(:last-child)]:mb-4 [&_ul]:list-disc [&_ul]:pl-5'

const ProductView = ({ slug }: { slug: string }) => {
  const d = useProductDetail({ slug })
  const [searchParams, setSearchParams] = useSearchParams()
  const [catalog, setCatalog] = useState<ProductSummary[] | null>(null)
  // A thumbnail the shopper clicked, valid until a new option pick changes the hook's image
  const [picked, setPicked] = useState<{ url: string; over: string | null } | null>(null)
  const appliedUrlVariant = useRef(false)

  // Prev/Next follow the shop's own order
  useEffect(() => {
    fetchProducts({ limit: 100 })
      .then(setCatalog)
      .catch(() => setCatalog([]))
  }, [])

  // ?variantId= → pick that variant's choices once the product has loaded
  const { product, optionGroups, variant, selectOption } = d
  useEffect(() => {
    if (!product || appliedUrlVariant.current) return
    appliedUrlVariant.current = true
    const fromUrl = product.variants.find((v) => v.variantId === searchParams.get('variantId'))
    if (fromUrl) Object.entries(fromUrl.choiceIds).forEach(([optionId, choiceId]) => selectOption(optionId, choiceId))
  }, [product, searchParams, selectOption])

  // The picked variant → ?variantId= (replace, so shade picks don't pile up in history)
  useEffect(() => {
    if (!appliedUrlVariant.current || !variant || optionGroups.length === 0) return
    if (searchParams.get('variantId') === variant.variantId) return
    setSearchParams({ variantId: variant.variantId }, { replace: true, preventScrollReset: true })
  }, [variant, optionGroups.length, searchParams, setSearchParams])

  if (d.notFound) {
    return (
      <main className="wrap py-[clamp(80px,10vw,140px)]">
        <title>Shop Our Products | Love You, Ci</title>
        <h1 className="font-display text-t-2xl leading-none">Product not found</h1>
        <p className="mt-6 text-t-lg text-stone">This product isn&rsquo;t available anymore.</p>
        <Link to="/shop" className="text-link">
          Back to shop <Icon icon={ChevronRight} size={15} />
        </Link>
      </main>
    )
  }

  const gallery = product?.gallery ?? []
  const mainImage = picked && picked.over === d.imageUrl ? picked.url : (d.imageUrl ?? gallery[0] ?? '')
  const index = catalog?.findIndex((p) => p.slug === slug) ?? -1
  const prev = index > 0 ? catalog![index - 1] : null
  const next = index >= 0 && catalog && index < catalog.length - 1 ? catalog[index + 1] : null

  return (
    <main className="wrap pt-[clamp(28px,4vw,48px)] pb-[clamp(80px,10vw,140px)]">
      {product && <title>{`${product.name} | Love You, Ci`}</title>}

      <div className="flex items-center justify-between gap-6 text-t-sm">
        <nav aria-label="Breadcrumb" className="min-w-0">
          <ol className="flex flex-wrap gap-x-2">
            <li>
              <Link to="/" className="transition-colors hover:text-rose-deep">
                Home
              </Link>
              <span className="ml-2 text-stone-light" aria-hidden>/</span>
            </li>
            <li>
              <Link to="/shop" className="transition-colors hover:text-rose-deep">
                Shop Our Products
              </Link>
              <span className="ml-2 text-stone-light" aria-hidden>/</span>
            </li>
            <li aria-current="page" className="truncate text-stone">
              {product?.name ?? '…'}
            </li>
          </ol>
        </nav>
        <nav aria-label="Product" className="flex shrink-0 items-center gap-3">
          <PagerLink to={prev ? `/shop/${prev.slug}` : null} label="Prev" icon={ChevronLeft} />
          <span className="h-4 w-px bg-(--hair)" aria-hidden />
          <PagerLink to={next ? `/shop/${next.slug}` : null} label="Next" icon={ChevronRight} after />
        </nav>
      </div>

      <div className="mt-[clamp(40px,6vw,88px)] grid grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-x-[clamp(32px,5vw,72px)] gap-y-12 bp-860:grid-cols-1">
        <div className="min-w-0">
          <div className="slot aspect-[4/5]">
            {mainImage && <img {...imgAttrs(mainImage, '(max-width: 860px) 100vw, 55vw', 5 / 4)} loading="eager" alt={product?.name ?? ''} />}
          </div>
          {gallery.length > 1 && (
            <ul className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(56px,1fr))] gap-2" aria-label="Product photos">
              {gallery.map((url, i) => (
                <li key={url}>
                  <button
                    type="button"
                    aria-label={`Show photo ${i + 1}`}
                    aria-pressed={url === mainImage}
                    onClick={() => setPicked({ url, over: d.imageUrl })}
                    className={`slot block aspect-square w-full cursor-pointer outline outline-1 outline-offset-2 transition-[outline-color] ${url === mainImage ? 'outline-ink' : 'outline-transparent hover:outline-stone-light'}`}
                  >
                    <img {...imgAttrs(url, '96px')} alt="" />
                  </button>
                </li>
              ))}
            </ul>
          )}
          {product?.descriptionHtml && (
            <div
              className={`mt-12 text-t-lg ${richText} bp-860:hidden`}
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />
          )}
        </div>

        <div className="min-w-0">
          {product ? (
            <>
              <h1 className="text-t-xl leading-tight font-semibold tracking-[0.2em] uppercase">{product.name}</h1>
              {product.ribbons.length > 0 && (
                <p className="mt-4 text-[0.75rem] font-semibold tracking-[0.28em] text-rose-deep uppercase">
                  {product.ribbons.join(' · ')}
                </p>
              )}
              <ProductPrice price={d.price} compareAtPrice={d.compareAtPrice} className="mt-6 text-t-lg" />
              {d.pricePerUnit && <p className="mt-1 text-t-sm text-stone">{d.pricePerUnit}</p>}
              <div className="mt-9">
                <OptionPicker detail={d} showQuantity />
              </div>
              {product.descriptionHtml && (
                <div
                  className={`mt-12 hidden ${richText} bp-860:block`}
                  dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                />
              )}
              {product.infoSections.length > 0 && (
                <div className="mt-12 border-t border-(--hair)">
                  {product.infoSections.map((section, i) => (
                    <details key={section.title} open={i === 0} className="group border-b border-(--hair)">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-t-sm font-medium tracking-[0.14em] uppercase [&::-webkit-details-marker]:hidden">
                        {section.title}
                        <span className="group-open:hidden">
                          <Icon icon={Plus} size={18} />
                        </span>
                        <span className="hidden group-open:inline">
                          <Icon icon={Minus} size={18} />
                        </span>
                      </summary>
                      <div className={`pb-6 text-stone ${richText}`} dangerouslySetInnerHTML={{ __html: section.html }} />
                    </details>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div aria-hidden>
              <div className="h-12 w-4/5 animate-pulse bg-mist" />
              <div className="mt-6 h-6 w-1/4 animate-pulse bg-mist" />
              <div className="mt-10 h-9 w-1/2 animate-pulse bg-mist" />
              <div className="mt-10 h-12 w-full animate-pulse bg-mist" />
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

type PagerLinkProps = {
  to: string | null
  label: string
  icon: typeof ChevronLeft
  after?: boolean
}

const PagerLink = ({ to, label, icon, after }: PagerLinkProps) => {
  const content = (
    <>
      {!after && <Icon icon={icon} size={16} />}
      {label}
      {after && <Icon icon={icon} size={16} />}
    </>
  )
  return to ? (
    <Link to={to} className="inline-flex items-center gap-1.5 transition-colors hover:text-rose-deep">
      {content}
    </Link>
  ) : (
    <span className="inline-flex items-center gap-1.5 text-stone-light" aria-disabled="true">
      {content}
    </span>
  )
}
