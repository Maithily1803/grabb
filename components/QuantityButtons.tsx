import { Product } from "@/sanity/sanity.types";
import useStore from "@/store";
import React from "react";
import { Button } from "./ui/button";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface Props {
  product: Product;
  className?: string;
}

const QuantityButtons = ({ product, className }: Props) => {
  const { addItem, removeItem, getItemCount } = useStore();
  const itemCount = getItemCount(product?._id);
  const isOutOfStock = product?.stock === 0;

  const handleRemoveProduct = () => {
    removeItem(product._id);
    if (itemCount > 1) {
      toast.success("Quantity decreased!");
    } else {
      toast.success(`${product.name?.substring(0, 20)} removed from cart`);
    }
  };

  const handleAddToCart = () => {
    if ((product.stock ?? 0) > itemCount) {
      addItem(product);
      toast.success("Quantity increased!");
    } else {
      toast.error("Cannot add more than available stock");
    }
  };

  return (
    <div className={cn("flex items-center gap-1 pb-1 text-base", className)}>
      <Button
        onClick={handleRemoveProduct}
        variant="outline"
        size="icon"
        disabled={itemCount === 0 || isOutOfStock}
        className="w-6 h-6 border-[1px] hover:bg-red-100 hoverEffect"
      >
        <Minus className="w-4 h-4" />
      </Button>

      <span className="font-semibold text-sm w-6 text-center text-darkColor">
        {itemCount}
      </span>

      <Button
        onClick={handleAddToCart}
        variant="outline"
        size="icon"
        disabled={isOutOfStock}
        className="w-6 h-6 border-[1px] hover:bg-green-100 hoverEffect"
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default QuantityButtons;
