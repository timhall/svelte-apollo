# svelte-apollo

Svelte integration for Apollo GraphQL.

```html
{#await books}
  Loading...
{:then data}
  {#each data.books as book}
    {book.title} by {book.author.name}
  {/each}
{:catch error}
  Error: {error}
{/await}

<form on:submit="create()">
  <h2>New Book<h2>

  <label for="title">Title</label>
  <input type="text" id="title" bind:value=title />
  
  <label for="author">Author</label> 
  <input type="text" id="author" bind:value=author />

  <button type="submit">Add Book</button>
</form>

<script>
  import gql from 'graphql-tag';
  import { query, mutation, connect } from 'svelte-apollo'; 

  const GET_BOOKS = gql`{
    books {
      title
      author {
        name
      }
    }
  }`

  const ADD_BOOK = gql`
    mutation addBook($title: String!, $author: String!) {
      addBook(title: $title, author: $author) {
        id
        title
        author {
          name
        }
      }
    }
  `;

  export default {
    data() {
      return {
        books: query(GET_BOOKS),
        title: '',
        author: ''
      };
    },
    
    onstate: connect,

    methods: {
      create: mutation(ADD_BOOK, (addBook, { title, author }) => {
        if (!title || !author) return;
        addBook({ variables: { title, author } });
      })
    }
  }
</script>
```

```js
import { Store } from 'svelte/store';
import App from './App.html';

import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'svelte-apollo';

const client = new ApolloClient({ uri: '...' });
const graphql = new ApolloProvider({ client });
const store = new Store({ graphql });

const app = new App({
  target: document.body,
  store
});
```
