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
  type Author {
    id: ID!
    name: String
    books: [Book]
  }
  type Book {
    id: ID!
    title: String
    author: Author
  }

  type Query {
    books: [Book]
    authors: [Author]
  }

  type Mutation {
    addAuthor(name: String!): Author
    addBook(title: String!, author: ID!): Book
  }

  schema {
    query: Query
    mutation: Mutation
  }
`;

const books = [{ id: 0, title: 'The Great Gatsby', author: 0 }];
const authors = [{ id: 0, name: 'F. Scott Fitzgerald' }];

const resolvers = {
  Query: {
    books: () => books,
    authors: () => authors
  },
  Mutation: {
    addAuthor(_, { name }) {
      const author = { id: authors.length, name };
      authors.push(author);

      return author;
    },
    addBook(_, { title, author }) {
      const book = { id: books.length, title, author: Number(author) };
      books.push(book);

      return book;
    }
  },
  Author: {
    books(author) {
      return books.filter(book => book.author === author.id);
    }
  },
  Book: {
    author(book) {
      return authors.find(author => author.id === book.author);
    }
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

        return new Store({ graphql });
      }
    })
  )
  .listen(process.env.PORT);
