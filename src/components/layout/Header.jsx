import { NavLink } from 'react-router-dom';
import './Header.css';

function enlaceClase({ isActive }) {
  return `header__link${isActive ? ' header__link--activo' : ''}`;
}

// Espacio reservado para las metricas: las pantallas que se agreguen
// despues completan estos valores con datos reales.
export function Header() {
  return (
    <header className="header">
      <div className="header__fila-superior">
        <span className="header__logo">Despacho2</span>
        <nav className="header__nav">
          <NavLink to="/" end className={enlaceClase}>
            Pedidos
          </NavLink>
          <NavLink to="/repartidores" className={enlaceClase}>
            Repartidores
          </NavLink>
        </nav>
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
