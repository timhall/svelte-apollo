import { init } from 'sapper/runtime.js';
import { routes } from './manifest/client.js';
import { Store } from 'svelte/store';

import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '../../';

const client = new ApolloClient({ uri: '/graphql' });
const graphql = new ApolloProvider({ client });

// `routes` is an array of route objects injected by Sapper
init(document.querySelector('#sapper'), routes, {
  store: data => {
    return new Store(Object.assign({ graphql }, data));
  }
});

if (module.hot) module.hot.accept();
