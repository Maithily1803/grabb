import { twMerge } from "tailwind-merge";
import PriceFormatter from "./PriceFormatter";

interface Props {
  price?: number;
  discount?: number;
  className?: string;
  priceClassName?: string;
}

const PriceView = ({ price = 0, discount = 0, className, priceClassName }: Props) => {
  const hasDiscount = discount > 0;
  const discountedPrice = price * (1 - discount / 100);

  return (
    <div className={twMerge("flex items-center justify-between gap-5", className)}>
      <div className="flex items-center gap-3">
        {/* Final Price */}
        <PriceFormatter
          amount={hasDiscount ? discountedPrice : price}
          className={twMerge("text-shop_dark_yellow", priceClassName)}
        />

        {/* Original Price (strikethrough) */}
        {hasDiscount && (
          <PriceFormatter
            amount={price}
            className={twMerge(
              "line-through text-gray-400",
              // Optional: scale it a bit smaller than main price
              priceClassName?.replace(/text-(\w+)/g, (match) => {
                // Convert text-3xl → text-lg, text-2xl → text-base, etc.
                if (match === "text-3xl") return "text-xl";
                if (match === "text-2xl") return "text-lg";
                if (match === "text-xl") return "text-base";
                if (match === "text-lg") return "text-sm";
                return "text-xs";
              })
            )}
          />
        )}
      </div>
    </div>
  );
};

export default PriceView;

