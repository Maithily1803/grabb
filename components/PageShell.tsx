import Container from "./Container";

const PageShell = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="relative overflow-hidden bg-white">

      <div className="pointer-events-none absolute -top-40 -right-40 h-[520px] w-[520px] rounded-full bg-shop_dark_yellow/30 blur-[140px]" />
      <div className="pointer-events-none absolute top-1/3 -left-52 h-[620px] w-[620px] rounded-full bg-shop_dark_yellow/15 blur-[160px]" />

      <Container className="relative z-10 max-w-6xl pt-28 pb-20">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-darkColor">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-6 max-w-2xl text-xl md:text-2xl font-medium text-darkColor/70">
            {subtitle}
          </p>
        )}
      </Container>

      <Container className="relative z-10 max-w-6xl pb-32">
        <div className="text-gray-700 text-lg leading-relaxed space-y-10">
          {children}
        </div>
      </Container>
    </div>
  );
};

export default PageShell;




