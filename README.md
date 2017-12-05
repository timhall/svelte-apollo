# svelte-apollo

Coming soon, graphql for svelte

```html
{{#await books}}
  Loading...
{{then data}}
  {{#each data.books as book}}
    {{book.title}} by {{book.author.name}}
  {{/each}}
{{catch error}}
  Error...
{{/await}}

<form on:submit="create()">
  <h2>New Book<h2>

  <label for="title">Title</label>
  <input type="text" id="title" bind:value="title" />
  
  <label for="author">Author</label> 
  <input type="text" id="author" bind:value="author" />

  <button type="submit">Add Book</button>
</form>

<script>
  import gql from 'graphql-tag';
  import { graphql, query, connect, disconnect } from 'svelte-apollo'; 

  export default {
    data: () => ({
      books: query(gql`{
        books {
          title
          author {
            name
          }
        }
      }`),
      title: '',
      author: ''
    }),
    
    oncreate() {
      connect(this);
    },
    ondestroy() {
      disconnect(this);
    },

    methods: {
      async create() {
        const title = this.get('title');
        const author = this.get('author');

        if (!title || !author) return;

        await graphql(this).mutate(gql`
          mutation addBook {
            addBook(title: ${title}, author: ${author}) {
              id
              title
              author {
                name
              }
            }
          }
        `);
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

const graphql = new ApolloProvider({ client });
const store = new Store({ graphql });

const app = new App({
  target: document.getElementById('app'),
  store
});
```
