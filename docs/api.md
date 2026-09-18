# API - Contrato de endpoints

Contrato REST que consume el frontend React para gestionar los errores
reportados al tópico `error-logs` de Kafka.

## Convenciones generales

- **Base URL:** `http://localhost:3000`
- **Formato:** todas las respuestas son `application/json`.
- **Envelope:** las respuestas exitosas usan `{ "data": ..., "meta": ... }`.
- **Fechas:** ISO-8601 UTC (ej: `2026-09-17T14:30:00Z`).
- Las rutas fuerzan el formato JSON servido incluso sin header `Accept`
  (`defaults: { format: :json }` en `config/routes.rb`).
- El recurso se llama `error_log`; una instancia es un evento de error
  persistido por el consumer Karafka.

Campos de un `error_log`:

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | integer | Identificador |
| `service_name` | string | Servicio que reporta el error |
| `error_type` | string | Clase o tipo del error |
| `message` | string | Descripción legible del error |
| `severity` | enum | `debug` / `info` / `warning` / `error` / `critical` |
| `status` | enum | `open` / `investigating` / `resolved` / `ignored` |
| `occurred_at` | date-time | Momento de ocurrencia (lo aporta el productor) |
| `created_at` | date-time | Ingreso al sistema |
| `updated_at` | date-time | Última modificación |
| `stack_trace` | string \| null | Traza de pila (solo en el detalle) |
| `metadata` | object | Contexto extensible (solo en el detalle) |

---

## `GET /errors`

Listado de errores con filtros, ordenamiento y paginación. El listado devuelve
**resúmenes** (sin `stack_trace` ni `metadata`).

### Parámetros de consulta

| Parámetro | Tipo | Descripción |
|---|---|---|
| `service_name` | string | Filtra por servicio exacto |
| `error_type` | string | Filtra por tipo de error exacto |
| `severity` | string | Filtra por severidad (enum) |
| `status` | string | Filtra por estado (enum) |
| `q` | string | Búsqueda por texto en `message`, `error_type` o `service_name` (LIKE) |
| `from` / `to` | date-time | Rango de `occurred_at` (ISO-8601) |
| `sort` | string | Columna de orden: `occurred_at` (default), `service_name`, `error_type`, `severity`, `status`, `created_at` |
| `order` | string | `desc` (default) u `asc` |
| `page` | integer | Página (default `1`) |
| `per_page` | integer | Tamaño de página (default `100`, máx `100`) |

### Respuestas

`200 OK`

~~~json
{
  "data": [
    {
      "id": 1,
      "service_name": "producer_division_by_cero",
      "error_type": "ZeroDivisionError",
      "message": "division by zero",
      "severity": "error",
      "status": "open",
      "occurred_at": "2026-09-17T14:30:00Z",
      "created_at": "2026-09-17T19:27:45Z",
      "updated_at": "2026-09-17T19:27:45Z"
    }
  ],
  "meta": {
    "page": 1,
    "per_page": 100,
    "total": 1,
    "total_pages": 1
  }
}
~~~

`400 Bad Request` — `from`/`to` no son fechas ISO-8601:

~~~json
{ "error": "from/to deben ser fechas ISO-8601" }
~~~

---

## `GET /errors/:id`

Detalle completo de un error, incluyendo `stack_trace` y `metadata`.

### Respuestas

`200 OK`

~~~json
{
  "data": {
    "id": 1,
    "service_name": "producer_division_by_cero",
    "error_type": "ZeroDivisionError",
    "message": "division by zero",
    "severity": "error",
    "status": "open",
    "occurred_at": "2026-09-17T14:30:00Z",
    "created_at": "2026-09-17T19:27:45Z",
    "updated_at": "2026-09-17T19:27:45Z",
    "stack_trace": "Traceback (most recent call last):\n  ...",
    "metadata": { "environment": "development", "user_id": 42 }
  }
}
~~~

`404 Not Found`

~~~json
{ "error": "error_log not found" }
~~~

---

## `PATCH /errors/:id`

Actualiza el estado (triage) de un error.

### Cuerpo de la petición

~~~json
{ "status": "investigating" }
~~~

`status` es obligatorio y debe ser uno de: `open`, `investigating`,
`resolved`, `ignored`.

### Respuestas

`200 OK` — devuelve el recurso actualizado (igual que `GET /errors/:id`).

`400 Bad Request` — falta el parámetro `status`.

`422 Unprocessable Entity` — `status` no es un valor válido:

~~~json
{ "error": "Status is not included in the list" }
~~~

`404 Not Found` — el id no existe.

---

## `GET /errors/summary`

Estadísticas agregadas para el dashboard.

### Parámetros de consulta (opcionales)

| Parámetro | Descripción |
|---|---|
| `from` / `to` | Rango de `occurred_at` |
| `service_name` | Restringe el recuento a un servicio |

### Respuestas

`200 OK`

~~~json
{
  "data": {
    "total": 2,
    "by_status": { "open": 1, "resolved": 1 },
    "by_severity": { "critical": 1, "error": 1 },
    "by_service": { "producer_division_by_cero": 1, "producer_index_error": 1 },
    "by_error_type": { "IndexError": 1, "ZeroDivisionError": 1 }
  }
}
~~~

---

## `GET /errors/meta`

Opciones de filtro para poblar los controles de la UI.

### Respuestas

`200 OK`

~~~json
{
  "data": {
    "severities": ["debug", "info", "warning", "error", "critical"],
    "statuses": ["open", "investigating", "resolved", "ignored"],
    "services": ["producer_division_by_cero", "producer_index_error"],
    "error_types": ["IndexError", "ZeroDivisionError"]
  }
}
~~~

`services` y `error_types` son los valores distintos que existan en la base en
ese momento; pueden estar vacíos.

---

## Enums

| Campo | Valores |
|---|---|
| `severity` | `debug`, `info`, `warning`, `error`, `critical` |
| `status` | `open`, `investigating`, `resolved`, `ignored` |

## Errores comunes

| Status | Significado |
|---|---|
| `400` | Parámetros inválidos (`from`/`to` mal formados, `status` ausente) |
| `404` | Recurso inexistente |
| `422` | Validación de modelo fallida (ej: `status` fuera del enum) |

Formato de error: `{ "error": "<descripción>" }`.