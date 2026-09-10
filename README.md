# despacho2-front

Tablero de pedidos con 4 columnas (pendiente, asignado, en camino, entregado).
Cada columna pide sus propios pedidos y maneja de forma independiente los
estados de carga, vacío y error (con reintento).

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

## Scripts

- `npm run dev`: entorno de desarrollo.
- `npm run build`: build de producción.
- `npm test`: tests (vitest + testing-library).
- `npm run lint`: chequeo de tipos.
