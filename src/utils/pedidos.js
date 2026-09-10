// Un pedido asignado o en camino que lleva mas de este umbral sin
// entregarse se considera demorado. El back no manda un flag propio,
// asi que el calculo se hace aca con lo que ya devuelve (asignadoEn).
const UMBRAL_DEMORA_MINUTOS = 45;

export function esPedidoDemorado(pedido) {
  if (pedido.estado !== 'asignado' && pedido.estado !== 'en_camino') return false;
  if (!pedido.asignadoEn) return false;
  const minutosDesdeAsignado = (Date.now() - new Date(pedido.asignadoEn).getTime()) / 60000;
  return minutosDesdeAsignado > UMBRAL_DEMORA_MINUTOS;
}

export function formatearImporte(importe) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(importe);
}
