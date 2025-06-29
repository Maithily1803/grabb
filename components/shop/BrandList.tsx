import React from "react";
import { BRANDS_QUERYResult } from "sanity.types";
import Title from "../Title";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";

interface Props {
  brands: BRANDS_QUERYResult;
  selectedBrand?: string | null;
  setSelectedBrand: React.Dispatch<React.SetStateAction<string | null>>;
}

const BrandList = ({ brands, selectedBrand, setSelectedBrand }: Props) => {
  return (
    <div className="w-full bg-white p-5 rounded-lg shadow-sm">
      <Title className="text-base font-black mb-2">Brands</Title>

      <RadioGroup value={selectedBrand || ""} className="space-y-1">
        {brands?.map((brand) => {
          const slug = brand?.slug?.current ?? brand?._id;
          return (
            <div
              key={brand._id}
              onClick={() => setSelectedBrand(slug)}
              className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded-md"
            >
              <RadioGroupItem
                value={slug}
                id={slug}
                className="rounded-sm"
              />
              <Label
                htmlFor={slug}
                className={`${
                  selectedBrand === slug
                    ? "font-semibold text-shop_dark_green"
                    : "font-normal"
                }`}
              >
                {brand.title}
              </Label>
            </div>
          );
        })}

        {selectedBrand && (
          <button
            onClick={() => setSelectedBrand(null)}
            className="text-sm mt-3 underline text-left text-shop_dark_green hover:text-shop_green transition"
          >
            Reset selection
          </button>
        )}
      </RadioGroup>
    </div>
  );
};

export default BrandList;
