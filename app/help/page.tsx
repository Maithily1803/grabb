import PageShell from "@/components/PageShell";

export default function HelpPage() {
  return (
    <PageShell
      title="Help"
      subtitle="Support that keeps things simple."
    >
      <p>
        Need help with orders, returns or payments?  
        We’re here to make things easy.
      </p>

      <p className="font-medium text-darkColor">
        Check FAQs or reach out directly for quick assistance.
      </p>
    </PageShell>
  );
}