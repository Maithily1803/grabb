import PageShell from "@/components/PageShell";

export default function ContactPage() {
  return (
    <PageShell
      title="Contact"
      subtitle="We’re always within reach."
    >
      <p>
        Have a question about your order, sizing or products?  
        Our team is here to help - quickly and clearly.
      </p>

      <p className="font-medium text-darkColor">
        Email: grabb@gmail.com  
        <br />
        Phone: +91 **********
      </p>

      <p>
        Support Hours  
        <br />
        Monday to Saturday || 10:00 AM - 7:00 PM
      </p>
    </PageShell>
  );
}


