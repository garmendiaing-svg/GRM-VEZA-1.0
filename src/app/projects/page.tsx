import { CalendarClock, CheckCircle2, ClipboardList, Zap } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { ModuleHeader } from "@/components/module-header";
import { StatusPill } from "@/components/status-pill";

const stages = [
  {
    title: "Diagnostico",
    status: "Activo",
    detail: "Boleta CGE analizada, potencia y reactivos con alerta.",
    tone: "teal" as const
  },
  {
    title: "Visita tecnica",
    status: "Pendiente",
    detail: "Revisar tablero, hornos, frio, motores y simultaneidad.",
    tone: "amber" as const
  },
  {
    title: "Implementacion",
    status: "Por cotizar",
    detail: "Compensacion reactiva, gestion de demanda y eficiencia.",
    tone: "zinc" as const
  },
  {
    title: "Monitoreo",
    status: "Planificado",
    detail: "Seguimiento mensual contra linea base acordada.",
    tone: "zinc" as const
  }
];

export default function ProjectsPage() {
  return (
    <AppShell>
      <ModuleHeader
        eyebrow="Seguimiento"
        title="Proyectos ESCO"
        description="Controla el avance desde diagnostico comercial hasta implementacion, medicion y monitoreo mensual."
        icon={ClipboardList}
      />

      <section className="mt-6 rounded-lg border border-zinc-200 bg-white p-6 shadow-panel">
        <div className="flex items-center gap-2 text-sm font-semibold uppercase text-teal-700">
          <Zap className="h-4 w-4" />
          Panaderia Centro
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stages.map((stage) => (
            <article
              key={stage.title}
              className="rounded-lg border border-zinc-200 bg-zinc-50 p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <CheckCircle2 className="h-5 w-5 text-teal-700" />
                <StatusPill tone={stage.tone}>{stage.status}</StatusPill>
              </div>
              <h2 className="mt-4 text-lg font-semibold text-industrial-ink">
                {stage.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                {stage.detail}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-lg border border-zinc-200 bg-white p-6 shadow-panel">
        <div className="flex items-center gap-2 text-sm font-semibold uppercase text-teal-700">
          <CalendarClock className="h-4 w-4" />
          Proximas actividades
        </div>
        <div className="mt-4 space-y-3">
          {[
            "Coordinar visita tecnica con fotos de tablero.",
            "Solicitar tres meses de boletas para linea base.",
            "Medir factor de potencia antes de dimensionar compensacion.",
            "Preparar propuesta con ahorro compartido y monitoreo."
          ].map((item) => (
            <div key={item} className="rounded-lg border border-zinc-200 p-4 text-sm text-zinc-700">
              {item}
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
