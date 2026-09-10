import { ApiStatusProvider } from './api/ApiStatusContext';
import { Layout } from './components/layout/Layout';
import { TableroPedidos } from './components/tablero/TableroPedidos';

function App() {
  return (
    <ApiStatusProvider>
      <Layout>
        <TableroPedidos />
      </Layout>
    </ApiStatusProvider>
  );
}

export default App;
