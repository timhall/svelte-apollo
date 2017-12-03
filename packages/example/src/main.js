import { Store } from 'svelte/store';
import App from './App.html';

import { ApolloProvider } from 'svelte-apollo';

import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

const client = new ApolloClient({
  link: new HttpLink(),
  cache: new InMemoryCache()
});

const graphql = new ApolloProvider(client);
const store = new Store({ graphql });
window.store = store;

const app = new App({
  target: document.body,
  store
});

export default app;
