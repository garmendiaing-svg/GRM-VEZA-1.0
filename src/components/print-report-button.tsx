"use client";

import { FileText } from "lucide-react";

export function PrintReportButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-industrial-ink px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
    >
      <FileText className="h-4 w-4" />
      PDF preliminar
    </button>
  );
}
