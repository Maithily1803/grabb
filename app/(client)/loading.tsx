import { Loader2 } from "lucide-react";
import Container from "@/components/Container";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <Container>
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="relative">
            <div className="absolute inset-0 animate-ping opacity-20">
              <div className="w-24 h-24 bg-shop_dark_yellow rounded-full"></div>
            </div>
            <div className="relative w-24 h-24 bg-shop_dark_yellow rounded-full flex items-center justify-center shadow-xl">
              <span className="text-4xl font-black text-white">G</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Loader2 className="w-8 h-8 text-shop_dark_yellow animate-spin" />
            <span className="text-lg font-semibold text-gray-700">
              Loading...
            </span>
          </div>

          <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-shop_dark_yellow rounded-full animate-loading-bar"></div>
          </div>
        </div>
      </Container>
    </div>
  );
}