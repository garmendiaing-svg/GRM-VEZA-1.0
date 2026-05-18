export type IntegrationStatus = "ACTIVE" | "READY" | "PENDING";

export function hasEnv(name: string): boolean {
  const value = process.env[name];
  return typeof value === "string" && value.trim().length > 0;
}

export function getRuntimeStatus() {
  const databaseUrl = process.env.DATABASE_URL ?? "";
  const databaseConfigured = databaseUrl.length > 0;
  const databaseLooksLocal = databaseUrl.includes("localhost");
  const s3Configured =
    hasEnv("S3_ENDPOINT") &&
    hasEnv("S3_BUCKET") &&
    hasEnv("S3_ACCESS_KEY_ID") &&
    hasEnv("S3_SECRET_ACCESS_KEY");
  const ocrProvider = process.env.OCR_PROVIDER ?? "manual";
  const authEnabled = hasEnv("APP_PASSCODE") || hasEnv("ADMIN_API_KEY");

  return {
    database: {
      status: databaseConfigured ? "READY" : "PENDING",
      configured: databaseConfigured,
      detail: databaseConfigured
        ? databaseLooksLocal
          ? "DATABASE_URL local configurada. En Vercel usa Postgres en la nube."
          : "DATABASE_URL configurada. Las APIs intentan persistir con Prisma."
        : "Falta conectar DATABASE_URL de Neon, Supabase o Railway."
    },
    storage: {
      status: s3Configured ? "READY" : "PENDING",
      configured: s3Configured,
      detail: s3Configured
        ? "Bucket S3-compatible configurado para URLs firmadas."
        : "Falta configurar S3_ENDPOINT, S3_BUCKET y credenciales."
    },
    ocr: {
      status: ocrProvider === "manual" ? "READY" : "PENDING",
      configured: ocrProvider === "manual" || hasEnv("OCR_API_KEY"),
      detail:
        ocrProvider === "manual"
          ? "OCR manual/demo activo. Puede normalizar texto pegado o datos extraidos."
          : "Proveedor OCR externo pendiente de credenciales."
    },
    auth: {
      status: authEnabled ? "READY" : "PENDING",
      configured: authEnabled,
      detail: authEnabled
        ? "Guard MVP activo mediante APP_PASSCODE o ADMIN_API_KEY."
        : "Falta definir APP_PASSCODE o integrar Auth.js/Clerk."
    }
  } satisfies Record<
    string,
    { status: IntegrationStatus; configured: boolean; detail: string }
  >;
}
