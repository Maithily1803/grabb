const ProductCardSkeleton = () => {
  return (
    <div className="text-sm border-[1px] rounded-md border-shop_light_blue bg-white animate-pulse">
      <div className="relative overflow-hidden bg-shop_light_bg">
        <div className="w-full h-[250px] bg-gray-200"></div>
        <div className="absolute top-2 right-2">
          <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
        </div>
      </div>

      <div className="p-3 flex flex-col gap-2">
        <div className="h-3 bg-gray-200 rounded w-24"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-3 h-3 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-3 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="h-3 bg-gray-200 rounded w-12"></div>
          <div className="h-3 bg-gray-200 rounded w-8"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-5 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="w-36 h-9 bg-gray-200 rounded-full mt-2"></div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;