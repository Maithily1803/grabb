import PageShell from "@/components/PageShell";

export default function FAQsPage() {
  return (
    <PageShell
      title="FAQs"
      subtitle="Quick answers. No confusion."
    >
      <div className="space-y-8">
        <div>
          <p className="font-semibold text-darkColor">
            How long does delivery take?
          </p>
          <p>Usually 3-7 business days, depending on location.</p>
        </div>

        <div>
          <p className="font-semibold text-darkColor">
            What’s the return policy?
          </p>
          <p>Easy returns within 7 days of delivery.</p>
        </div>

        <div>
          <p className="font-semibold text-darkColor">
            Are payments secure?
          </p>
          <p>Yes. All payments are processed through encrypted gateways.</p>
        </div>

        <div>
          <p className="font-semibold text-darkColor">
            Can I cancel my order?
          </p>
          <p>Orders can be cancelled before dispatch.</p>
        </div>
      </div>
    </PageShell>
  );
}

