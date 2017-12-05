import { Store } from 'svelte/store';
import App from './App.html';

import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'svelte-apollo';

const client = new ApolloClient({
  link: new HttpLink({ uri: '/graphql' }),
  cache: new InMemoryCache()
});
const graphql = new ApolloProvider({ client });

const store = new Store({ graphql });

window.client = client;
window.graphql = graphql;
window.store = store;

const app = new App({
  target: document.body,
  store
});

export default app;
