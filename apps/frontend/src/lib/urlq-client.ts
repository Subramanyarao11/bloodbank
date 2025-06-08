import { createClient, fetchExchange } from 'urql';
import { authExchange } from '@urql/exchange-auth';
import { getAuthToken, removeAuthToken } from './auth';

const client = createClient({
  url: 'http://localhost:3000/graphql',
  exchanges: [
    authExchange(async (utils) => {
      return {
        addAuthToOperation(operation) {
          const token = getAuthToken();
          if (!token) return operation;

          return utils.appendHeaders(operation, {
            Authorization: `Bearer ${token}`,
          });
        },
        didAuthError(error) {
          return error.graphQLErrors.some(
            (e) => e.extensions?.code === 'UNAUTHENTICATED'
          );
        },
        async refreshAuth() {
          removeAuthToken();
          window.location.href = '/login';
        },
      };
    }),
    fetchExchange,
  ],
});

export default client;
