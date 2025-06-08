import { Provider } from 'urql';
import { AuthProvider } from './contexts/AuthContext';
import client from './lib/urlq-client';

function App() {
  return (
    <>
      <Provider value={client}>
        <AuthProvider>
          <div>Blood bank</div>
        </AuthProvider>
      </Provider>
    </>
  )
}

export default App
