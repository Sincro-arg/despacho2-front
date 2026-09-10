import { createContext, useContext, useEffect, useState } from 'react';
import { onApiStatusChange, api } from './client';

const ApiStatusContext = createContext({ estado: 'verificando' });

// Ping liviano contra un endpoint que ya existe en el back. Sirve tanto
// para el chequeo inicial como para los reintentos mientras esta offline.
function ping() {
  return api.get('/repartidores').catch(() => {
    // el propio client.js ya notifico 'offline', aca no hay nada mas que hacer
  });
}

export function ApiStatusProvider({ children }) {
  // 'verificando' | 'online' | 'offline'
  const [estado, setEstado] = useState('verificando');

  useEffect(() => {
    const quitarListener = onApiStatusChange(setEstado);

    ping();
    const intervalId = setInterval(() => {
      setEstado((actual) => {
        if (actual === 'offline') ping();
        return actual;
      });
    }, 15000);

    return () => {
      quitarListener();
      clearInterval(intervalId);
    };
  }, []);

  return (
    <ApiStatusContext.Provider value={{ estado }}>
      {children}
    </ApiStatusContext.Provider>
  );
}

export function useApiStatus() {
  return useContext(ApiStatusContext);
}
