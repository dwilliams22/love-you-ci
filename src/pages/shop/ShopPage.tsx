import { ProductCard, ProductCardSkeleton } from '../../components/shop/ProductCard'
import { useShop } from '../../hooks/storefront/useShop'

export const ShopPage = () => {
  const { products, error, retry, hasMore, loadMore, loadingMore } = useShop()

  return (
    <main className="wrap py-[clamp(64px,8vw,112px)]">
      <title>Shop Our Products | Love You, Ci</title>
      <h1 className="font-display text-t-2xl leading-none">Shop Our Products</h1>

      {error && !products?.length ? (
        <div className="mt-16 text-stone" role="alert">
          <p>We couldn&rsquo;t load the products right now.</p>
          <button type="button" className="text-link cursor-pointer" onClick={retry}>
            Try again
          </button>
        </div>
      ) : products?.length === 0 ? (
        <p className="mt-16 text-stone">No products are available right now. Please check back soon.</p>
      ) : (
        <ul className="mt-[clamp(40px,5vw,64px)] grid grid-cols-3 gap-x-[clamp(24px,3vw,44px)] gap-y-20 bp-860:grid-cols-2 bp-560:grid-cols-1 bp-560:px-[6%]">
          {products
            ? products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)
            : Array.from({ length: 3 }, (_, i) => <ProductCardSkeleton key={i} />)}
        </ul>
      )}

      {hasMore && (
        <div className="mt-16 text-center">
          <button type="button" className="cta cursor-pointer" onClick={loadMore} disabled={loadingMore}>
            {loadingMore ? 'Loading…' : 'Load more'}
          </button>
        </div>
      )}
    </main>
  )
}
