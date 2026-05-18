"use client";

import { useState } from "react";
import { Building2, CheckCircle2, Loader2, Save } from "lucide-react";

type Status = "idle" | "saving" | "saved" | "error";

export function ClientIntakeForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({
    name: "Minimarket Los Andes",
    taxId: "77.777.777-7",
    email: "contacto@minimarket.cl",
    phone: "+56 9 1234 5678",
    siteName: "Local principal",
    businessType: "minimarket",
    address: "Los Andes, Chile"
  });

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setStatus("idle");
  }

  async function submit() {
    setStatus("saving");

    try {
      const response = await fetch("/api/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          taxId: form.taxId,
          email: form.email,
          phone: form.phone,
          site: {
            name: form.siteName,
            businessType: form.businessType,
            address: form.address
          }
        })
      });

      if (!response.ok) {
        throw new Error("Could not create company");
      }

      setStatus("saved");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-panel">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
            <Building2 className="h-4 w-4 text-teal-700" />
            Alta rapida de cliente
          </div>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Registro minimo para iniciar diagnostico y asociar boletas a un sitio.
          </p>
        </div>
        <button
          type="button"
          onClick={submit}
          disabled={status === "saving"}
          className="focus-ring inline-flex items-center gap-2 rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === "saving" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Crear
        </button>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {[
          ["name", "Empresa"],
          ["taxId", "RUT"],
          ["email", "Email"],
          ["phone", "Telefono"],
          ["siteName", "Sitio"],
          ["businessType", "Rubro"],
          ["address", "Direccion"]
        ].map(([field, label]) => (
          <label key={field} className="block">
            <span className="text-sm font-medium text-zinc-700">{label}</span>
            <input
              className="focus-ring mt-2 w-full rounded-md border border-zinc-200 bg-white px-3 py-2.5 text-sm text-industrial-ink"
              value={form[field as keyof typeof form]}
              onChange={(event) =>
                update(field as keyof typeof form, event.target.value)
              }
            />
          </label>
        ))}
      </div>

      {status === "saved" ? (
        <p className="mt-4 inline-flex items-center gap-2 rounded-md bg-teal-50 px-3 py-2 text-sm font-medium text-teal-700">
          <CheckCircle2 className="h-4 w-4" />
          Cliente creado para esta sesion de demo.
        </p>
      ) : null}
      {status === "error" ? (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
          No se pudo crear el cliente. Revisa los datos.
        </p>
      ) : null}
    </section>
  );
}
