type ProductPriceProps = {
  price: string
  compareAtPrice?: string | null
  maxPrice?: string
  fromPrice?: boolean
  className?: string
}

// Prices come from the DTO as-is: "From" for a discounted range, "a – b" for a range,
// otherwise the price with the struck "was" price before it (as on Ci's Wix store)
export const ProductPrice = ({ price, compareAtPrice, maxPrice, fromPrice, className = '' }: ProductPriceProps) => {
  if (fromPrice) return <p className={className}>From {price}</p>
  if (maxPrice && maxPrice !== price) return <p className={className}>{`${price} – ${maxPrice}`}</p>
  return (
    <p className={className}>
      {compareAtPrice && (
        <>
          <span className="sr-only">Was </span>
          <s className="mr-3 text-stone">{compareAtPrice}</s>
          <span className="sr-only">now </span>
        </>
      )}
      {price}
    </p>
  )
}

