export function formatCurrency(value?: number | null): string {
  const amount = typeof value === "number" && Number.isFinite(value) ? value : 0;

  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatPercent(value?: number | null): string {
  const amount = typeof value === "number" && Number.isFinite(value) ? value : 0;

  return new Intl.NumberFormat("es-CL", {
    style: "percent",
    maximumFractionDigits: 1
  }).format(amount);
}

export function formatNumber(value?: number | null): string {
  const amount = typeof value === "number" && Number.isFinite(value) ? value : 0;

  return new Intl.NumberFormat("es-CL", {
    maximumFractionDigits: 1
  }).format(amount);
}
