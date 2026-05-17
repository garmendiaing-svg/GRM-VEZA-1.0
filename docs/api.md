# API MVP

Todas las respuestas usan JSON. Los montos se expresan en CLP y los porcentajes se entregan como valores entre `0` y `1`.

## GET `/api/dashboard`

Retorna una vista consolidada para el dashboard.

## POST `/api/companies`

Crea una empresa y, opcionalmente, un primer sitio.

```json
{
  "name": "Panaderia Centro",
  "taxId": "76.123.456-7",
  "email": "contacto@panaderia.cl",
  "site": {
    "name": "Local matriz",
    "businessType": "panaderia",
    "address": "Santiago"
  }
}
```

## POST `/api/bills`

Registra una boleta y genera diagnostico automatico.

```json
{
  "siteId": "site_demo",
  "distributor": "CGE",
  "billingMonth": "2026-04",
  "totalAmountClp": 859812,
  "energyKwh": 4620,
  "energyCostClp": 347581,
  "powerChargeClp": 310562,
  "reactivePenaltyClp": 92140,
  "otherChargesClp": 109529
}
```

## POST `/api/analyze`

Calcula un diagnostico sin persistirlo.

## POST `/api/proposals`

Genera una propuesta comercial preliminar desde un analisis.

## POST `/api/reports`

Devuelve el contenido estructurado de un informe preliminar. La exportacion PDF queda lista para conectar con un renderer server-side.
