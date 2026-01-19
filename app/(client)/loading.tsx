import Container from "@/components/Container";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Container>
        <div className="flex flex-col items-center gap-6">
          <div className="text-4xl font-extrabold text-shop_dark_yellow tracking-wider animate-pulse">
            GRABB
          </div>

          <div className="w-56 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full w-1/3 bg-shop_dark_yellow animate-loading-bar" />
          </div>

          <p className="text-sm text-gray-500">
            Loading your fashion…
          </p>
        </div>
      </Container>
    </div>
  );
}
