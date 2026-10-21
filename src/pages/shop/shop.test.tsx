import { screen, waitFor, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderRoute } from '../../test/renderRoute'
import type { ProductDetail, ProductSummary } from '../../wix/storefront/types'

const summary = (slug: string, name: string, extra: Partial<ProductSummary> = {}) =>
  ({
    id: slug,
    slug,
    name,
    price: '$14.00',
    maxPrice: '$14.00',
    fromPrice: false,
    compareAtPrice: '$15.00',
    ribbons: [],
    swatches: [],
    optionsSummary: '',
    imageUrl: '',
    availability: 'IN_STOCK',
    preorder: false,
    hasSubscriptions: false,
    quickAddable: true,
    minPriceVariantId: 'v1',
    ...extra,
  }) as unknown as ProductSummary

const bundle = summary('bundle', 'Butter Gloss Bundle', { price: '$36.00', maxPrice: '$36.00', compareAtPrice: null })
const gloss = summary('gloss', 'Butter Gloss')

const product = {
  ...gloss,
  descriptionHtml: '<p>High shine.</p>',
  infoSections: [{ title: 'Product info', html: '<ul><li>Smooth feel</li></ul>' }],
  gallery: [],
  modifiers: [],
  subscriptions: [],
  variants: [
    { variantId: 'v1', choiceIds: { shade: 'allure' } },
    { variantId: 'v2', choiceIds: { shade: 'adore' } },
  ],
} as unknown as ProductDetail

const mocks = vi.hoisted(() => ({
  detail: {} as Record<string, unknown>,
  itemCount: 0,
}))

vi.mock('../../hooks/storefront/useShop', () => ({
  useShop: () => ({ products: [bundle, gloss], error: null, retry: vi.fn(), hasMore: false, loadMore: vi.fn(), loadingMore: false }),
}))
vi.mock('../../hooks/storefront/useProductDetail', () => ({
  ONE_TIME_PLAN: 'one-time',
  useProductDetail: () => mocks.detail,
}))
vi.mock('../../wix/storefront/catalog', () => ({ fetchProducts: () => Promise.resolve([bundle, gloss]) }))
vi.mock('../../hooks/storefront/useCart', () => ({
  useCart: () => ({
    itemCount: mocks.itemCount,
    cart: null,
    open: false,
    busy: false,
    error: null,
    pendingProductId: null,
    openCart: vi.fn(),
    closeCart: vi.fn(),
    addToCart: vi.fn(),
  }),
}))

const baseDetail = {
  product,
  notFound: false,
  optionGroups: [
    {
      id: 'shade',
      name: 'Name',
      isColor: true,
      choices: [
        { choiceId: 'allure', name: 'Allure', colorCode: '#b97c74', inStock: true, exists: true, selected: false },
        { choiceId: 'adore', name: 'Adore', colorCode: '#d9a5a0', inStock: true, exists: true, selected: false },
      ],
    },
  ],
  variant: null,
  imageUrl: null,
  price: '$14.00',
  compareAtPrice: '$15.00',
  pricePerUnit: null,
  plans: [],
  quantity: 1,
  maxQuantity: 99999,
  canAdd: false,
  blockedReason: 'Choose Name',
  remaining: null,
  isPreorder: false,
  canNotify: false,
  error: null,
  modifierValues: {},
}

beforeEach(() => {
  mocks.itemCount = 0
  mocks.detail = { ...baseDetail, selectOption: vi.fn(), setQuantity: vi.fn(), add: vi.fn() }
})

describe('shop', () => {
  it('lists products as links to their pages with the struck "was" price', () => {
    renderRoute('/shop')
    const cards = within(screen.getByRole('main')).getAllByRole('listitem')
    expect(cards).toHaveLength(2)
    expect(within(cards[1]).getByRole('link', { name: 'Butter Gloss' })).toHaveAttribute('href', '/shop/gloss')
    expect(within(cards[1]).getByText('$15.00').tagName).toBe('S')
  })

  it('picks the shade named by ?variantId= on load', async () => {
    renderRoute('/shop/gloss?variantId=v2')
    await waitFor(() => expect(mocks.detail.selectOption).toHaveBeenCalledWith('shade', 'adore'))
  })

  it('mirrors the picked variant into ?variantId=', async () => {
    mocks.detail.variant = { variantId: 'v1', choiceIds: { shade: 'allure' } }
    const { router } = renderRoute('/shop/gloss')
    await waitFor(() => expect(router.state.location.search).toBe('?variantId=v1'))
  })

  it('renders the product page like the Wix one: breadcrumb, prev/next, price, info sections', async () => {
    renderRoute('/shop/gloss')
    expect(screen.getByRole('heading', { level: 1, name: 'Butter Gloss' })).toBeInTheDocument()
    expect(within(screen.getByRole('navigation', { name: 'Breadcrumb' })).getByRole('link', { name: 'Shop Our Products' })).toHaveAttribute('href', '/shop')
    expect(screen.getByText('Product info')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add to Cart' })).toBeDisabled()
    expect(screen.getByText('Choose Name')).toBeInTheDocument()
    await waitFor(() => expect(screen.getByRole('link', { name: 'Prev' })).toHaveAttribute('href', '/shop/bundle'))
    await waitFor(() => expect(document.title).toBe('Butter Gloss | Love You, Ci'))
  })

  it('shows the cart count in the header', () => {
    mocks.itemCount = 2
    renderRoute('/shop')
    expect(screen.getByRole('button', { name: 'Cart, 2 items' })).toBeInTheDocument()
  })

  it('has a thank-you page that points to the confirmation email', async () => {
    renderRoute('/shop/thank-you')
    expect(screen.getByRole('heading', { level: 1, name: 'Thank you' })).toBeInTheDocument()
    expect(screen.getByText(/order confirmation will arrive by email/)).toBeInTheDocument()
    await waitFor(() => expect(document.title).toBe('Thank You | Love You, Ci'))
  })
})
