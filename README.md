# despacho2-front

Tablero de pedidos con 4 columnas (pendiente, asignado, en camino, entregado).
Cada columna pide sus propios pedidos y maneja de forma independiente los
estados de carga, vacío y error (con reintento).

Incluye también un panel de repartidores (listado, alta, edición y baja
lógica) con confirmación visible en cada acción y sus propios estados de
carga, vacío y error.

## Configuración

### Desarrollo: front + back juntos, sin configurar nada

`vite.config.ts` ya tiene un proxy que redirige `/pedidos`, `/repartidores`,
`/metricas` y `/zonas` hacia `http://localhost:3001`. Para ver el tablero con
datos reales:

1. `despacho2-back`: `npm start` (levanta en el puerto 3001, ver su README).
2. `despacho2-front`: `npm run dev` (puerto 5173).

No hace falta ninguna variable de entorno en este caso.

### Otros casos: `VITE_API_URL`

Si el back corre en otro puerto/host, o para `npm run preview` /
producción (donde el proxy de Vite dev no aplica), definir la variable de
entorno `VITE_API_URL` con la URL base del back, por ejemplo:

```
VITE_API_URL=http://localhost:3001 npm run dev
```

o en un archivo `.env.local` (no versionado):

```
VITE_API_URL=http://localhost:3001
```

## Contrato esperado del back

`GET {VITE_API_URL}/pedidos?estado=pendiente|asignado|en_camino|entregado`

Devuelve un array de pedidos:

```json
[
  {
    "id": "1",
    "cliente": "Juan Perez",
    "direccion": "Av. Siempre Viva 123",
    "zona": "Norte",
    "importe": 1500,
    "estado": "pendiente",
    "repartidor": null,
    "demorado": false
  }
]
```

- `repartidor`: nombre del repartidor asignado, o `null`/ausente si todavía
  no hay uno.
- `demorado`: `true` si el back calcula que el pedido está fuera de tiempo.
  El front lo usa para resaltar la tarjeta (borde y badge).

### Repartidores

`GET {VITE_API_URL}/repartidores`

Devuelve un array de repartidores:

```json
[
  {
    "id": "1",
    "nombre": "Ana Gomez",
    "telefono": "11-2233-4455",
    "vehiculo": "Moto",
    "estado": "activo"
  }
]
```

- `estado`: `"activo"` o `"inactivo"`. La baja es lógica: el front nunca
  borra un repartidor, lo desactiva.

`POST {VITE_API_URL}/repartidores`

Body `{ "nombre", "telefono", "vehiculo" }`. Devuelve el repartidor creado
con `estado: "activo"`.

`PUT {VITE_API_URL}/repartidores/:id`

Body `{ "nombre", "telefono", "vehiculo" }`. Devuelve el repartidor
actualizado. No cambia `estado`.

`DELETE {VITE_API_URL}/repartidores/:id`

Baja lógica: el back debe marcar `estado: "inactivo"` en vez de borrar la
fila. El front solo espera una respuesta con status 2xx (no necesita body).

### Métricas

`GET {VITE_API_URL}/metricas`

```json
{
  "entregados": 12,
  "facturado": 45000,
  "tiempoPromedioMinutos": 28,
  "demorados": 2,
  "porRepartidor": [
    { "repartidorId": "1", "repartidor": "Ana Gomez", "entregas": 7 }
  ]
}
```

### Zonas

`GET {VITE_API_URL}/zonas`

Las 4 zonas fijas con su recargo (todavía sin usar desde el front; el
formulario de pedido pide la zona como texto libre).

```json
[
  { "zona": "Centro", "recargo": 0 },
  { "zona": "Norte", "recargo": 0.1 },
  { "zona": "Sur", "recargo": 0.1 },
  { "zona": "Oeste", "recargo": 0.15 }
]
```

## Scripts

- `npm run dev`: entorno de desarrollo.
- `npm run build`: build de producción.
- `npm test`: tests (vitest + testing-library).
- `npm run lint`: chequeo de tipos.
