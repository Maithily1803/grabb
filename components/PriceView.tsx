import { twMerge } from "tailwind-merge";
import PriceFormatter from "./PriceFormatter";

interface Props {
  price?: number;
  discount?: number;
  className?: string;
}

const PriceView = ({ price = 0, discount = 0, className }: Props) => {
  const hasDiscount = discount > 0;
  const discountedPrice = price * (1 - discount / 100);

  return (
    <div className={twMerge("flex items-center justify-between gap-5", className)}>
      <div className="flex items-center gap-2">
        {/* Show discounted or regular price in yellow */}
        <PriceFormatter
          amount={hasDiscount ? discountedPrice : price}
          className="text-shop_dark_yellow"
        />

        {/* If there is a discount, show original price struck through */}
        {hasDiscount && (
          <PriceFormatter
            amount={price}
            className="line-through text-xs font-normal text-zinc-500"
          />
        )}
      </div>
    </div>
  );
};

export default PriceView;

