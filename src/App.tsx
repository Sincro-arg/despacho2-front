import { useState } from 'react';
import { TableroPedidos } from './components/TableroPedidos';
import { PanelRepartidores } from './components/PanelRepartidores';
import './App.css';

type Vista = 'pedidos' | 'repartidores';

export function App() {
  const [vista, setVista] = useState<Vista>('pedidos');

  return (
    <div className="app">
      <header className="app__header">
        <h1>Despacho</h1>
        <nav className="app__nav">
          <button
            type="button"
            className={vista === 'pedidos' ? 'app__nav-boton app__nav-boton--activo' : 'app__nav-boton'}
            onClick={() => setVista('pedidos')}
          >
            Pedidos
          </button>
          <button
            type="button"
            className={
              vista === 'repartidores' ? 'app__nav-boton app__nav-boton--activo' : 'app__nav-boton'
            }
            onClick={() => setVista('repartidores')}
          >
            Repartidores
          </button>
        </nav>
      </header>
      <main>{vista === 'pedidos' ? <TableroPedidos /> : <PanelRepartidores />}</main>
    </div>
  );
}
