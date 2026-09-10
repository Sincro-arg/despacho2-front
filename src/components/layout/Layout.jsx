import { Header } from './Header';
import { BannerConexion } from './BannerConexion';
import './Layout.css';

// Layout general de la app: lo va a envolver todo lo que se agregue
// despues (pantallas de pedidos, repartidores, etc).
export function Layout({ children }) {
  return (
    <div className="layout">
      <Header />
      <BannerConexion />
      <main className="layout__contenido">{children}</main>
    </div>
  );
}
