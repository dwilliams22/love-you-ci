// Header cart icon with a live count badge — mount once in your header, as-is.
// Opens the CartDrawer (mount that once too, anywhere in the page).
// Love You, Ci: Lucide icon at the Log In link's size, badge on the site tokens.
import { ShoppingBag } from "lucide-react";
import { useCart } from "../../hooks/storefront/useCart";
import { Icon } from "../ui/Icon";

export default function CartButton() {
  const { itemCount, openCart } = useCart();
  return (
    <button
      type="button"
      aria-label={`Cart, ${itemCount} ${itemCount === 1 ? "item" : "items"}`}
      onClick={openCart}
      className="cart-btn relative grid size-11 shrink-0 cursor-pointer place-items-center transition-colors hover:text-rose-deep"
    >
      <Icon icon={ShoppingBag} size={20} />
      {itemCount > 0 && (
        <span className="absolute top-1 right-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-ink px-1 text-[0.6875rem] leading-none font-medium text-paper tabular-nums">
          {itemCount}
        </span>
      )}
    </button>
  );
}
