# svelte-apollo

Svelte integration for Apollo GraphQL.

## Example

```html
<!-- App.html -->

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
  import { query, mutation, connect } from 'svelte-apollo'; 
  import { GET_BOOKS, ADD_BOOK } from './queries';

  export default {
    data() {
      return {
        books: query(GET_BOOKS),
        title: '',
        author: ''
      };
    },

    methods: {
      create: mutation(ADD_BOOK, addBook => function() {
        //                       ^ a        ^ b
        //
        // a: called with the generated mutation and returns method
        // b: called with method arguments
        //
        // Warning: (b) should be a function expression, not an arrow function,
        //          if you need to access the component with `this`
        const { title, author } = this.get();
        if (!title || !author) return;

        addBook({ variables: { title, author } });
      })
    },

    onstate: connect,
    //       ^ Connect component queries / mutations with Apollo provider
  }
</script>
```

```js
// main.js

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

## query

Query an attached Apollo provider, returning an observable that is compatible with `{#await ...}`.
svelte-apollo handles subscriptions internally and it is safe to use `query` in computed properties.

```html
<script>
  import { query } from 'svelte-apollo';
  import { GET_BOOKS, SEARCH_BOOKS } from './queries';

  export default {
    data() {
      return {
        // static query
        list: query(GET_BOOKS),
        search: ''
      };
    },

    computed: {
      // dynamic query
      results: ({ search }) => query(SEARCH_BOOKS, { variables: { search } })
    }
  }
```

## mutation

Mutations are designed to be performed in methods, can take arguments and component state
add pass them as variables to the mutation, and perform other tasks before executing the mutation, such as validation.

```html
<button on:click=simple()>Simple</button>
<button on:click=complex("svelte")>Complex</button>

<script>
  import { mutation } from 'svelte-apollo';
  import { SIMPLE, SEARCH_BOOKS } from './queries';

  export default {
    data() {
      return {
        author: ''
      }
    },

    methods: {
      simple: mutation(SIMPLE),
      complex: mutation(SEARCH_BOOKS, searchBooks => function(search) {
        const { author } = this.get();
        searchBooks({ variables: { author, search } });
      });
    }
  }
</script>
```

## refetch

Explicitly refetch a query with the `refetch` method.

```html
<button on:click=refetch(books)>Reload Books</button>

<script>
  import { query, refetch } from 'svelte-apollo';
  import { GET_BOOKS } from './queries';

  export default {
    data() {
      return {
        books: query(GET_BOOKS)
      }
    },

    methods: {
      refetch
    }
  }
</script>
```

## connect

Connect is essential for connecting queries and mutations in the component to the Apollo provider.
Once connected, svelte-apollo handles subscriptions and properly unsubscribes when the component is destroyed.

```html
<script>
  import { connect } from 'svelte-apollo';

  export default {
    onstate: connect,

    // or

    onstate({ changed, current }) {
      // ...

      connect.call(this, { changed, current });
    }
  }
</script>
```

## ApolloProvider

The Apollo provider is passed through the application's `sveltejs/store` so that it is available in all components without having to explicitly pass it to each one.

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
