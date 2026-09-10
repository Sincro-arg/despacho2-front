import './Header.css';

// Espacio reservado para las metricas: las pantallas que se agreguen
// despues completan estos valores con datos reales.
export function Header() {
  return (
    <header className="header">
      <div className="header__marca">
        <span className="header__logo">Despacho2</span>
      </div>
      <div className="header__metricas">
        <div className="header__metrica">
          <span className="header__metrica-valor">--</span>
          <span className="header__metrica-etiqueta">Pendientes</span>
        </div>
        <div className="header__metrica">
          <span className="header__metrica-valor">--</span>
          <span className="header__metrica-etiqueta">En camino</span>
        </div>
        <div className="header__metrica">
          <span className="header__metrica-valor">--</span>
          <span className="header__metrica-etiqueta">Repartidores libres</span>
        </div>
      </div>
    </header>
  );
}
