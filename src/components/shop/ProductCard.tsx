import { Link } from 'react-router'
import { Image } from 'lucide-react'
import { imgAttrs } from '../../wix/media'
import type { ProductSummary } from '../../wix/storefront/types'
import QuickAdd from '../storefront/QuickAdd'
import { Icon } from '../ui/Icon'
import { ProductPrice } from './ProductPrice'

type ProductCardProps = {
  product: ProductSummary
  index: number
}

// Alternating tilt + tape angle, like the service cards and the landing page's Our Looks
const tiltClass = (index: number) =>
  index % 2 ? '[transform:rotate(1deg)] [--tape-rot:-3deg]' : '[transform:rotate(-1.2deg)] [--tape-rot:2deg]'

export const ProductCard = ({ product, index }: ProductCardProps) => {
  const href = `/shop/${product.slug}`
  return (
    // QuickAdd anchors its option picker to this relative flex column
    <li className="relative flex flex-col">
      <Link to={href} tabIndex={-1} aria-hidden className={`taped tape-rose block aspect-[4/5] ${tiltClass(index)}`}>
        <div className="slot h-full">
          <span>
            <Icon icon={Image} size={14} />
            {product.name}
          </span>
          {product.imageUrl && <img {...imgAttrs(product.imageUrl, '(max-width: 560px) 90vw, 33vw', 5 / 4)} alt="" />}
        </div>
      </Link>
      <div className="mt-7 flex flex-1 flex-col">
        {product.ribbons.length > 0 && (
          <p className="mb-2 text-[0.75rem] font-semibold tracking-[0.28em] text-rose-deep uppercase">
            {product.ribbons.join(' · ')}
          </p>
        )}
        <h2 className="text-t-lg leading-tight font-semibold tracking-[0.2em] uppercase">
          <Link to={href} className="transition-colors hover:text-rose-deep">
            {product.name}
          </Link>
        </h2>
        <ProductPrice
          price={product.price}
          compareAtPrice={product.compareAtPrice}
          maxPrice={product.maxPrice}
          fromPrice={product.fromPrice}
          className="mt-3 text-[0.9375rem] font-normal tracking-[0.02em]" />
        {product.swatches.length > 0 && (
          <p className="mt-3 flex gap-1.5" aria-label={product.optionsSummary}>
            {product.swatches.map((hex) => (
              <span key={hex} className="size-3.5 rounded-full border border-(--hair)" style={{ backgroundColor: hex }} />
            ))}
          </p>
        )}
        {/* pins itself to the bottom (mt-auto) so the buttons line up across a row */}
        <QuickAdd product={product} />
      </div>
    </li>
  )
}

export const ProductCardSkeleton = () => (
  <li className="flex flex-col" aria-hidden>
    <div className="taped aspect-[4/5]">
      <div className="slot h-full animate-pulse" />
    </div>
    <div className="mt-7 h-7 w-2/3 animate-pulse bg-mist" />
    <div className="mt-3 h-4 w-1/4 animate-pulse bg-mist" />
    <div className="mt-6 h-10 w-full animate-pulse bg-mist" />
  </li>
)
