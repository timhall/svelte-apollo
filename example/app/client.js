import { init } from 'sapper/runtime.js';
import { Store } from 'svelte/store.js';
import { routes } from './manifest/client.js';
import App from './App.html';

import ApolloClient from 'apollo-boost';
import { createProvider } from '../../';

init({
  App,
  target: document.querySelector('#sapper'),
  routes,
  store: data => {
    const client = new ApolloClient({ uri: '/graphql' });

    return new Store({
      ...data,
      graphql: createProvider(client, { from: data && data.graphql })
    });
  }
});
