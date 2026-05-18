import { Database, PanelTop, ShieldCheck } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { ModuleHeader } from "@/components/module-header";
import { StatusPill } from "@/components/status-pill";
import { getRuntimeStatus } from "@/server/config/runtime";

function label(status: "ACTIVE" | "READY" | "PENDING") {
  if (status === "ACTIVE") {
    return "Activo";
  }

  if (status === "READY") {
    return "Listo";
  }

  return "Pendiente";
}

function tone(status: "ACTIVE" | "READY" | "PENDING") {
  return status === "PENDING" ? "amber" : "teal";
}

export default function AdminPage() {
  const runtime = getRuntimeStatus();
  const checks = [
    ["Next.js", "ACTIVE", "Frontend y API routes desplegadas en Vercel."],
    ["Prisma schema", "READY", "Modelo de datos preparado para PostgreSQL."],
    ["Base de datos", runtime.database.status, runtime.database.detail],
    ["OCR", runtime.ocr.status, runtime.ocr.detail],
    ["Storage", runtime.storage.status, runtime.storage.detail],
    ["Auth", runtime.auth.status, runtime.auth.detail]
  ] as const;

  return (
    <AppShell>
      <ModuleHeader
        eyebrow="Panel admin"
        title="Configuracion MVP"
        description="Estado tecnico de integraciones, datos, seguridad y despliegue para pasar de demo a SaaS real."
        icon={PanelTop}
      />

      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {checks.map(([name, status, detail]) => (
          <article
            key={name}
            className="rounded-lg border border-zinc-200 bg-white p-5 shadow-panel"
          >
            <div className="flex items-center justify-between gap-3">
              <Database className="h-5 w-5 text-teal-700" />
              <StatusPill tone={tone(status)}>
                {label(status)}
              </StatusPill>
            </div>
            <h2 className="mt-4 text-lg font-semibold text-industrial-ink">
              {name}
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600">{detail}</p>
          </article>
        ))}
      </section>

      <section className="mt-6 rounded-lg border border-zinc-200 bg-white p-6 shadow-panel">
        <div className="flex items-center gap-2 text-sm font-semibold uppercase text-teal-700">
          <ShieldCheck className="h-4 w-4" />
          Nota importante
        </div>
        <p className="mt-3 text-sm leading-6 text-zinc-600">
          Las APIs ya intentan usar Prisma si DATABASE_URL existe. Si una
          integracion no tiene credenciales o falla, el MVP conserva fallback demo
          para no dejar la aplicacion inutilizable durante configuracion.
        </p>
      </section>
    </AppShell>
  );
}
