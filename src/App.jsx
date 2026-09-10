import { Routes, Route } from 'react-router-dom';
import { ApiStatusProvider } from './api/ApiStatusContext';
import { Layout } from './components/layout/Layout';
import { TableroPedidos } from './components/tablero/TableroPedidos';
import { PanelRepartidores } from './components/repartidores/PanelRepartidores';

function App() {
  return (
    <ApiStatusProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<TableroPedidos />} />
          <Route path="/repartidores" element={<PanelRepartidores />} />
        </Routes>
      </Layout>
    </ApiStatusProvider>
  );
}

export default App;
