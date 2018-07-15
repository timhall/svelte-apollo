import sirv from 'sirv';
import polka from 'polka';
import sapper from 'sapper';
const { Store } = require('svelte/store.js');
import compression from 'compression';
import { routes } from './manifest/server.js';
import App from './App.html';

import ApolloClient from 'apollo-boost';
import fetch from 'node-fetch';
import { createProvider } from '../../';

global.fetch = fetch;

polka() // You can also use Express
  .use(
    compression({ threshold: 0 }),
    sirv('assets'),
    sapper({
      routes,
      App,
      store: () => {
        const client = new ApolloClient({ uri: '...' });

        return new Store({
          graphql: createProvider(client, { ssr: true })
        });
      }
    })
  )
  .listen(process.env.PORT)
  .catch(err => {
    console.log('error', err);
  });
