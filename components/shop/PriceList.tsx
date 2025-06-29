"use client";

import React from "react";
import Title from "../Title";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";

const priceArray = [
  { title: "Under ₹1000", value: "0-1000" },
  { title: "₹1000 - ₹2000", value: "1000-2000" },
  { title: "₹2000 - ₹3000", value: "2000-3000" },
  { title: "₹3000 - ₹5000", value: "3000-5000" },
  { title: "Over ₹5000", value: "5000-100000" },
];

interface Props {
  selectedPrice?: string | null;
  setSelectedPrice: React.Dispatch<React.SetStateAction<string | null>>;
}

const PriceList = ({ selectedPrice, setSelectedPrice }: Props) => {
  return (
    <div className="w-full bg-white p-5 rounded-md shadow-sm">
      <Title className="text-base font-black">Price</Title>

      <RadioGroup className="mt-4 space-y-2" value={selectedPrice || ""}>
        {priceArray.map((price) => (
          <div
            key={price.value}
            onClick={() => setSelectedPrice(price.value)}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <RadioGroupItem
              value={price.value}
              id={price.value}
              className="rounded-sm"
            />
            <Label
              htmlFor={price.value}
              className={
                selectedPrice === price.value
                  ? "font-semibold text-shop_dark_green"
                  : "font-normal"
              }
            >
              {price.title}
            </Label>
          </div>
        ))}
      </RadioGroup>

      {selectedPrice && (
        <button
          onClick={() => setSelectedPrice(null)}
          className="text-sm font-medium mt-4 underline hover:text-shop_dark_green transition-colors"
        >
          Reset selection
        </button>
      )}
    </div>
  );
};

export default PriceList;
