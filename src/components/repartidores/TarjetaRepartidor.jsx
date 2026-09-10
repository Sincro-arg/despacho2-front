import './TarjetaRepartidor.css';

const ETIQUETAS_ESTADO = {
  libre: 'Libre',
  en_ruta: 'En ruta',
  descanso: 'Descanso',
};

const ETIQUETAS_VEHICULO = {
  moto: 'Moto',
  bici: 'Bici',
};

export function TarjetaRepartidor({ repartidor, onEditar, onDarDeBaja }) {
  return (
    <article className={`tarjeta-repartidor${!repartidor.activo ? ' tarjeta-repartidor--inactivo' : ''}`}>
      <div className="tarjeta-repartidor__fila-principal">
        <p className="tarjeta-repartidor__nombre">{repartidor.nombre}</p>
        <span className={`tarjeta-repartidor__estado tarjeta-repartidor__estado--${repartidor.estado}`}>
          {ETIQUETAS_ESTADO[repartidor.estado] || repartidor.estado}
        </span>
      </div>

      <p className="tarjeta-repartidor__dato">Telefono: {repartidor.telefono}</p>
      <p className="tarjeta-repartidor__dato">
        Vehiculo: {ETIQUETAS_VEHICULO[repartidor.vehiculo] || repartidor.vehiculo}
      </p>

      {!repartidor.activo && <span className="tarjeta-repartidor__badge-inactivo">Inactivo</span>}

      {repartidor.activo && (
        <div className="tarjeta-repartidor__acciones">
          <button type="button" onClick={() => onEditar(repartidor)}>
            Editar
          </button>
          <button
            type="button"
            className="tarjeta-repartidor__baja"
            onClick={() => onDarDeBaja(repartidor)}
          >
            Dar de baja
          </button>
        </div>
      )}
    </article>
  );
}
