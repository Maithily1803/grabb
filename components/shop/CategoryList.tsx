"use client";

import React from "react";
import { Category } from "@/sanity.types";
import Title from "../Title";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";

interface Props {
  categories: Category[];
  selectedCategory?: string | null;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string | null>>;
}

const CategoryList = ({
  categories,
  selectedCategory,
  setSelectedCategory,
}: Props) => {
  return (
    <div className="w-full bg-white p-5 rounded-md shadow-sm">
      <Title className="text-base font-black">Product Categories</Title>
      <RadioGroup value={selectedCategory || ""} className="mt-4 space-y-2">
        {categories?.map((category) => (
          <div
            key={category._id}
            onClick={() => setSelectedCategory(category.slug?.current ?? "")}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <RadioGroupItem
              value={category.slug?.current ?? ""}
              id={category.slug?.current}
              className="rounded-sm"
            />
            <Label
              htmlFor={category.slug?.current}
              className={`${
                selectedCategory === category.slug?.current
                  ? "font-semibold text-shop_dark_green"
                  : "font-normal"
              }`}
            >
              {category.title}
            </Label>
          </div>
        ))}
      </RadioGroup>

      {selectedCategory && (
        <button
          onClick={() => setSelectedCategory(null)}
          className="text-sm font-medium mt-4 underline hover:text-shop_dark_green transition-colors"
        >
          Reset selection
        </button>
      )}
    </div>
  );
};

export default CategoryList;
