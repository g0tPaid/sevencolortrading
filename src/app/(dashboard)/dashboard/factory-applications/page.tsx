import { FactoryApplicationsTable } from "@/components/dashboard/factory-applications-table";
import { listApplications } from "@/lib/factory-applications-store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function FactoryApplicationsPage() {
  const applications = await listApplications();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink">Factory applications</h1>
        <p className="mt-2 text-sm text-muted">
          Chinese factories applying to supply Sourcing Center buyers. Review, contact, then approve
          or reject.
        </p>
      </div>
      <FactoryApplicationsTable initial={applications} />
    </div>
  );
}
