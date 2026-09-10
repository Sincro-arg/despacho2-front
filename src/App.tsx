import { TableroPedidos } from './components/TableroPedidos';
import './App.css';

export function App() {
  return (
    <div className="app">
      <header className="app__header">
        <h1>Tablero de pedidos</h1>
      </header>
      <main>
        <TableroPedidos />
      </main>
    </div>
  );
}
