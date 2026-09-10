# despacho2-front

Tablero de pedidos con 4 columnas (pendiente, asignado, en camino, entregado).
Cada columna pide sus propios pedidos y maneja de forma independiente los
estados de carga, vacío y error (con reintento).

Incluye también un panel de repartidores (listado, alta, edición y baja
lógica) con confirmación visible en cada acción y sus propios estados de
carga, vacío y error.

## Configuración

Variable de entorno `VITE_API_URL`: URL base del back (por ejemplo
`http://localhost:3000`). Ver `despacho2-back`.

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

## Scripts

- `npm run dev`: entorno de desarrollo.
- `npm run build`: build de producción.
- `npm test`: tests (vitest + testing-library).
- `npm run lint`: chequeo de tipos.
