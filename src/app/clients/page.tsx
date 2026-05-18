import { Building2, FileText } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { ClientIntakeForm } from "@/components/client-intake-form";
import { ModuleHeader } from "@/components/module-header";
import { StatusPill } from "@/components/status-pill";
import { getDashboardSnapshot } from "@/server/data/store";

export default function ClientsPage() {
  const snapshot = getDashboardSnapshot();

  return (
    <AppShell>
      <ModuleHeader
        eyebrow="Modulo de clientes"
        title="Clientes y sitios"
        description="Administra empresas, locales y rubros antes de asociar boletas electricas, fotos de tablero y proyectos."
        icon={Building2}
      />

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_380px]">
        <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-panel">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase text-teal-700">
                Cartera
              </p>
              <h2 className="mt-2 text-xl font-semibold text-industrial-ink">
                Empresas activas
              </h2>
            </div>
            <StatusPill tone="teal">{snapshot.companies.length} cliente</StatusPill>
          </div>

          <div className="mt-5 divide-y divide-zinc-200">
            {snapshot.companies.map((company) => {
              const companySites = snapshot.sites.filter(
                (site) => site.companyId === company.id
              );

              return (
                <div key={company.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-semibold text-industrial-ink">
                        {company.name}
                      </p>
                      <p className="mt-1 text-sm text-zinc-500">
                        {company.taxId ?? "RUT pendiente"} · {company.email}
                      </p>
                    </div>
                    <StatusPill>{companySites.length} sitio</StatusPill>
                  </div>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    {companySites.map((site) => (
                      <div
                        key={site.id}
                        className="rounded-lg border border-zinc-200 bg-zinc-50 p-4"
                      >
                        <div className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
                          <FileText className="h-4 w-4 text-teal-700" />
                          {site.name}
                        </div>
                        <p className="mt-2 text-sm text-zinc-600">
                          {site.businessType ?? "Rubro pendiente"} ·{" "}
                          {site.address ?? "Direccion pendiente"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <ClientIntakeForm />
      </div>
    </AppShell>
  );
}
