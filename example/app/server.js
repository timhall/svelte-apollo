import sirv from 'sirv';
import express from 'express';
import sapper from 'sapper';
const { Store } = require('svelte/store.js');
import compression from 'compression';
import { routes } from './manifest/server.js';
import App from './App.html';

import { ApolloServer, gql } from 'apollo-server-express';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createProvider } from '../../';

import fetch from 'node-fetch';
global.fetch = fetch;

const typeDefs = gql`
  type Query {
    hello: String
  }

  schema {
    query: Query
  }
`;
const resolvers = {
  Query: {
    hello: () => 'Howdy!'
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();
server.applyMiddleware({ app });

app
  .use(
    compression({ threshold: 0 }),
    sirv('assets'),
    sapper({
      routes,
      App,
      store: req => {
        const client = new ApolloClient({
          ssrMode: true,
          link: createHttpLink({
            uri: 'http://localhost:3000/graphql',
            credentials: 'same-origin',
            headers: {
              cookie: req.header('Cookie')
            }
          }),
          cache: new InMemoryCache()
        });
        const graphql = createProvider(client, { ssr: true });

        return new Store({ graphql, test: 'Howdy!' });
      }
    })
  )
  .listen(process.env.PORT);
