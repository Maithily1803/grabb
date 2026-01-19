import PageShell from "@/components/PageShell";

export default function TermsPage() {
  return (
    <PageShell
      title="Terms"
      subtitle="Simple rules for a smooth experience."
    >
      <ul className="space-y-6 list-disc list-inside">
        <li>
          Using GRABB means you agree to follow our platform policies.
        </li>
        <li>
          Prices, availability and offers may change without notice.
        </li>
        <li>
          Orders may be cancelled if misuse or fraud is suspected.
        </li>
        <li>
          All content is protected and may not be reused without permission.
        </li>
      </ul>
    </PageShell>
  );
}

