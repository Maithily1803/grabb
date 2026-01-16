import { Loader2 } from "lucide-react";

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="absolute inset-0 animate-ping opacity-20">
            <div className="w-20 h-20 bg-shop_dark_yellow rounded-full"></div>
          </div>
          <div className="relative w-20 h-20 bg-shop_dark_yellow rounded-full flex items-center justify-center shadow-xl">
            <span className="text-3xl font-black text-white">G</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 text-shop_dark_yellow animate-spin" />
          <span className="text-base font-semibold text-gray-700">
            Loading...
          </span>
        </div>
      </div>
    </div>
  );
}