import { Store } from 'svelte/store';
import App from './App.html';

import { ApolloProvider } from '../../';

// TODO Some rollup issues to resolve here
// import { ApolloClient } from 'apollo-client';
// import { HttpLink } from 'apollo-link-http';
// import { InMemoryCache } from 'apollo-cache-inmemory';

// const client = new ApolloClient({
//   link: new HttpLink(),
//   cache: new InMemoryCache()
// });

const client = {};

const graphql = new ApolloProvider(client);
const store = new Store({ graphql });

const app = new App({
  target: document.getElementById('app'),
  store
});

export default app;
