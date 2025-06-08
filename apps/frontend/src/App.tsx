import { Provider } from 'urql';
import { AuthProvider } from './contexts/AuthContext';
import client from './lib/urlq-client';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { routes } from './routes';
import { Toaster } from 'react-hot-toast';

function AppRoutes() {
    const element = useRoutes(routes);
    return element;
  }

function App() {
  return (
    <>
      <Provider value={client}>
        <AuthProvider>
        <BrowserRouter>
          <div className="App">
            <AppRoutes />
            <Toaster position="top-right" />
          </div>
        </BrowserRouter>
        </AuthProvider>
      </Provider>
    </>
  )
}

export default App
