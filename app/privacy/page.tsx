import PageShell from "@/components/PageShell";

export default function PrivacyPage() {
  return (
    <PageShell
      title="Privacy"
      subtitle="Your data. Handled with care."
    >
      <p>
        We collect only what’s necessary to process orders and improve your
        experience.
      </p>

      <p className="font-medium text-darkColor">
        Your information is never sold or misused.
      </p>

      <p>
        Secure systems and industry standards protect your data at every step.
      </p>
    </PageShell>
  );
}

