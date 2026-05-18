"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";
import { Loader2, LogIn } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/";
  const [passcode, setPasscode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passcode })
    });

    if (!response.ok) {
      setStatus("error");
      return;
    }

    router.replace(next);
    router.refresh();
  }

  return (
    <form
      onSubmit={submit}
      className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-6 shadow-panel"
    >
      <p className="text-sm font-semibold uppercase text-teal-700">
        Acceso privado
      </p>
      <h1 className="mt-2 text-2xl font-semibold text-industrial-ink">
        ElectroFit SaaS/ESCO
      </h1>
      <p className="mt-2 text-sm leading-6 text-zinc-600">
        Ingresa la clave configurada para el piloto.
      </p>

      <label className="mt-5 block">
        <span className="text-sm font-medium text-zinc-700">Clave</span>
        <input
          className="focus-ring mt-2 w-full rounded-md border border-zinc-200 bg-white px-3 py-2.5 text-sm text-industrial-ink"
          type="password"
          value={passcode}
          onChange={(event) => setPasscode(event.target.value)}
        />
      </label>

      <button
        type="submit"
        disabled={status === "loading"}
        className="focus-ring mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-industrial-ink px-4 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "loading" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <LogIn className="h-4 w-4" />
        )}
        Entrar
      </button>

      {status === "error" ? (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
          Clave incorrecta.
        </p>
      ) : null}
    </form>
  );
}
