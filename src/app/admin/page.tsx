import { Database, PanelTop, ShieldCheck } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { ModuleHeader } from "@/components/module-header";
import { StatusPill } from "@/components/status-pill";

const checks = [
  ["Next.js", "Activo", "Frontend y API routes desplegadas en Vercel."],
  ["Prisma schema", "Listo", "Modelo de datos preparado para PostgreSQL."],
  ["Base de datos", "Pendiente", "Falta conectar DATABASE_URL de Neon, Supabase o Railway."],
  ["OCR", "Pendiente", "Listo para integrar proveedor y guardar rawOcr."],
  ["Storage", "Pendiente", "Configurar bucket S3-compatible para PDFs y fotos."],
  ["Auth", "Pendiente", "Definir Auth.js, Clerk u otro proveedor."]
];

export default function AdminPage() {
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
              <StatusPill tone={status === "Pendiente" ? "amber" : "teal"}>
                {status}
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
          En Vercel, los datos creados por formularios no quedan persistidos de
          forma confiable hasta conectar PostgreSQL real y cambiar el repositorio
          temporal por Prisma. La demo ya permite navegar y probar calculos.
        </p>
      </section>
    </AppShell>
  );
}
