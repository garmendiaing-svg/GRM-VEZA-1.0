# Pendientes para pasar de demo a SaaS operativo

## 1. Base de datos

Crear una base PostgreSQL en Neon, Supabase o Railway y agregar en Vercel:

```env
DATABASE_URL="postgresql://..."
```

Luego ejecutar desde un ambiente con acceso a esa URL:

```bash
npm run prisma:generate
npm run prisma:push
```

Las APIs ya intentan usar Prisma cuando `DATABASE_URL` existe. Si falla, vuelven al store demo para no romper el sitio.

## 2. Storage

Configurar un bucket S3-compatible y agregar:

```env
S3_ENDPOINT=""
S3_REGION="auto"
S3_BUCKET=""
S3_ACCESS_KEY_ID=""
S3_SECRET_ACCESS_KEY=""
S3_PUBLIC_BASE_URL=""
```

Endpoint disponible:

- `POST /api/uploads`

Devuelve una URL firmada para cargar PDFs o imagenes.

## 3. OCR

El MVP tiene OCR manual/demo:

- `POST /api/ocr`
- `OCR_PROVIDER="manual"`

Permite pegar texto extraido y normalizar campos de boleta. Para proveedor externo, agregar `OCR_PROVIDER` y `OCR_API_KEY`.

## 4. Auth

Guard MVP para APIs y app privada:

```env
ADMIN_API_KEY=""
APP_PASSCODE=""
```

Si `APP_PASSCODE` existe, la app pide clave en `/login`. Si `ADMIN_API_KEY` existe, los endpoints de escritura esperan header:

```http
x-api-key: <ADMIN_API_KEY>
```

Para usuarios finales conviene integrar Auth.js o Clerk en la siguiente iteracion.
