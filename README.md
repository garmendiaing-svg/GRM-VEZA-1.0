# ElectroFit SaaS/ESCO

Plataforma SaaS para diagnostico preliminar de ahorro electrico en comercios y pequenas industrias de Chile y LATAM. El MVP permite crear clientes, ingresar boletas electricas, calcular oportunidades de ahorro, revisar recomendaciones y preparar una propuesta comercial inicial.

## Stack

- Next.js App Router + TypeScript
- TailwindCSS
- API routes de Next.js para el MVP
- PostgreSQL + Prisma ORM
- Storage S3-compatible para boletas, fotos de tablero y evidencias
- OCR plug-in ready
- Docker para base de datos local

## Primer uso

```bash
cp .env.example .env
docker compose up -d
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

La primera pantalla es el dashboard operativo. La ruta `/bills/new` permite ingresar una boleta manual y calcular el diagnostico preliminar sin que el usuario entienda conceptos electricos.

## Modulos MVP

- Clientes, empresas y sitios.
- Boletas electricas.
- Motor de reglas energeticas auditable.
- Dashboard de ahorro potencial.
- API para boletas, diagnosticos, propuestas e informes.
- Vista de informe preliminar.
- Esquema Prisma listo para Postgres.

## Principios de producto

- Traducir datos tecnicos a ahorro economico claro.
- Separar reglas electricas de UI y persistencia.
- Registrar trazabilidad de cada calculo.
- No prometer ahorro garantizado sin medicion.
- Disenar para Chile primero, con expansion LATAM.

## Endpoints

- `GET /api/dashboard`
- `POST /api/companies`
- `POST /api/bills`
- `POST /api/analyze`
- `POST /api/proposals`
- `POST /api/reports`

Ver detalles en [docs/api.md](./docs/api.md).

## Vercel y produccion

El MVP ya incluye fallback demo, pero para persistencia real debes configurar `DATABASE_URL` en Vercel y ejecutar `npm run prisma:push` contra una base PostgreSQL. Los pasos de base de datos, storage, OCR y auth estan en [docs/vercel-next-steps.md](./docs/vercel-next-steps.md).
