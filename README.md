# svelte-apollo

Coming soon, graphql for svelte

```html
{{#await query}}
  Loading...
{{then data}}
  <dl>
    <dt>Book</dt><dd>#{{id}}</dd>
    <dt>Name</dt><dd>{{data.name}}</dd>
    <dt>Author</dt><dd>{{data.author.name}}</dd>
  </dl>
{{catch error}}
  Error...
{{/await}}

<form on:submit="create()">
  <label for="name">Name</label>
  <input type="text" id="name" bind:value="name" />
  
  <label for="author">Author</label> 
  <input type="text" id="author" bind:value="author" />

  <button type="submit">Add Book</button>
</form>

<script>
  import gql from 'graphql-tag';
  import { graphql } from 'svelte-apollo'; 

  export default {
    data: () => ({ name: '', author: '' }),

    computed: {
      query: ($graphql, id) => $graphql.query(gql`
        book(id: $id) {
          name,
          author: {
            name
          }
        }
      `, { id })
    },

    methods: {
      async create() {
        const name = this.get('name');
        const author = this.get('author');

        await graphql(this).mutate(gql`
          mutation {
            ...
          }
        `, { name, author });
      }
    }
  }
</script>
```

```js
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

const app = new App({
  target: document.getElementById('app'),
  store
});
```
