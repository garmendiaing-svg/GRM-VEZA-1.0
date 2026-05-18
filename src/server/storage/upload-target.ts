import { randomUUID } from "node:crypto";

function safeFileName(fileName: string) {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 120);
}

function storageConfigured() {
  return Boolean(
    process.env.S3_ENDPOINT &&
      process.env.S3_BUCKET &&
      process.env.S3_ACCESS_KEY_ID &&
      process.env.S3_SECRET_ACCESS_KEY
  );
}

export async function createUploadTarget(input: {
  fileName: string;
  contentType: string;
  folder?: "bills" | "boards" | "evidence";
}) {
  const folder = input.folder ?? "bills";
  const key = `${folder}/${new Date().toISOString().slice(0, 10)}/${randomUUID()}-${safeFileName(input.fileName)}`;

  if (!storageConfigured()) {
    return {
      mode: "demo",
      key,
      uploadUrl: null,
      fileUrl: `/demo-storage/${key}`,
      expiresInSeconds: 0,
      detail:
        "Storage demo: configura S3_ENDPOINT, S3_BUCKET y credenciales para URLs firmadas reales."
    };
  }

  const [{ S3Client, PutObjectCommand }, { getSignedUrl }] = await Promise.all([
    import("@aws-sdk/client-s3"),
    import("@aws-sdk/s3-request-presigner")
  ]);

  const bucket = process.env.S3_BUCKET as string;
  const client = new S3Client({
    endpoint: process.env.S3_ENDPOINT,
    region: process.env.S3_REGION ?? "auto",
    forcePathStyle: true,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string
    }
  });

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: input.contentType
  });

  const uploadUrl = await getSignedUrl(client, command, { expiresIn: 900 });
  const publicBaseUrl = process.env.S3_PUBLIC_BASE_URL?.replace(/\/$/, "");

  return {
    mode: "s3",
    key,
    uploadUrl,
    fileUrl: publicBaseUrl ? `${publicBaseUrl}/${key}` : `s3://${bucket}/${key}`,
    expiresInSeconds: 900,
    detail: "URL firmada generada para carga directa al bucket."
  };
}
