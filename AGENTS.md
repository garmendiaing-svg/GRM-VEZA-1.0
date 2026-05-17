# AGENTS.md

## Producto

Plataforma SaaS/ESCO para reduccion de costos electricos en comercios y pequenas industrias.

## Principio central

El usuario final NO necesita entender electricidad.
El sistema debe traducir datos tecnicos en ahorro economico claro.

## Cliente objetivo

- Panaderias
- Minimarkets
- Restaurantes
- Cafeterias
- Talleres
- Frigorificos
- Pequenas industrias

## Problemas a detectar

- Alto consumo kWh.
- Potencia contratada sobredimensionada.
- Demanda maxima mal gestionada.
- Cargos por potencia en punta.
- Multa por energia reactiva.
- Bajo factor de potencia.
- Consumos parasitos.
- Iluminacion ineficiente.
- Posible mala calidad de energia.
- Riesgos normativos en tableros/empalmes.

## Modelo de negocio

- Diagnostico inicial.
- Ingenieria.
- Implementacion electrica.
- Suscripcion de monitoreo.
- Financiamiento parcial.
- Ahorro compartido.

## Reglas de desarrollo

- Priorizar simplicidad.
- Separar logica tecnica de UI.
- Todo calculo debe ser auditable.
- Guardar trazabilidad.
- No prometer ahorro garantizado sin medicion.
- Disenar para Chile primero.

## Entidades principales

- User
- Company
- Site
- ElectricBill
- EnergyAnalysis
- Project
- Proposal
- Measurement
- Recommendation
- Invoice
- Subscription

## Arquitectura

- `src/domain`: reglas de negocio puras, sin dependencia de Next.js.
- `src/app/api`: endpoints del MVP.
- `src/server/data`: repositorio temporal en memoria para demo local, reemplazable por Prisma.
- `src/components`: componentes de UI reutilizables.
- `prisma/schema.prisma`: contrato de datos Postgres.
- `docs`: documentacion tecnica, API y decisiones de producto.

## MVP

Debe permitir:

1. Crear cliente.
2. Subir o registrar boleta.
3. Ingresar datos manuales.
4. Calcular diagnostico inicial.
5. Mostrar ahorro potencial.
6. Generar informe simple.
7. Crear propuesta comercial.

## Criterios de calidad

- Cada diagnostico debe exponer supuestos, porcentajes y reglas aplicadas.
- Las recomendaciones deben ser accionables y comprensibles.
- La UI debe priorizar dinero, riesgo y proximo paso.
- Las APIs deben aceptar datos incompletos porque el OCR puede fallar.
