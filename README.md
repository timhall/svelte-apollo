# svelte-apollo

Svelte integration for Apollo GraphQL.

## Example

The following simple example shows how to run a simple query with svelte-apollo. There are more complete examples included in the [examples directory](#todo).

```html
<!-- App.svelte -->
<Books />

<script>
  import ApolloClient from 'apollo-boost';  
  import { setClient } from 'svelte-apollo';
  import Books from './Books.svelte';

  // 1. Create an Apollo client and pass it to all child components
  //    (uses svelte's built-in context)
  const client = new ApolloClient({ uri: '...' });
  setClient(client);
</script>
```

```html
<!-- Books.svelte -->
<script>
  import { getClient, query } from 'svelte-apollo'; 
  import { GET_BOOKS } from './queries';

  // 2. Get the Apollo client from context
  const client = getClient();

  // 3. Execute the GET_BOOKS graphql query using the Apollo client
  //    -> Returns a svelte store of promises that resolve as values come in
  const books = query(client, { query: GET_BOOKS });
</script>

<!-- 4. Use $books (note the "$"), to subscribe to query values -->
{#await $books}
  Loading...
{:then result}
  {#each result.data.books as book}
    {book.title} by {book.author.name}
  {/each}
{:catch error}
  Error: {error}
{/await}
```

## API

<a href="#query" name="query">#</a> <b>query</b>(<i>client</i>, <i>options</i>)

Query an Apollo client, returning a store that is compatible with `{#await $...}`.
Uses Apollo's [`watchQuery`](https://www.apollographql.com/docs/react/api/apollo-client.html#ApolloClient.watchQuery),
for fetching from the network and watching the local cache for changes.
If the client is hydrating after SSR, it attempts a `readQuery` to synchronously check the cache for values.

```html
<script>
  import { getClient, query } from 'svelte-apollo';
  import { GET_BOOKS } from './queries';

  const client = getClient();
  const books = query(client, {
    query: GET_BOOKS

    // variables, fetchPolicy, errorPolicy, and others
  });

  function reload() {
    books.refetch();
  }
</script>

<ul>
  {#await $books}
    <li>Loading...</li>
  {:then result}
    {#each result.data.books as book (book.id)}
      <li>{book.title} by {book.author.name}</li>
    {/each}
  {:catch error}
    <li>ERROR: {error}</li>
  {/await}
</ul>

<button on:click={reload}>Reload</button>
```

Note, stores in svelte should be constant and at the top level.
If your query depends on reactive variables, [`prepare`](#prepare) is a better option
for efficiently refetching queries as variables change.

<a href="#prepare" name="prepare">#</a> <b>prepare</b>(<i>client</i>, <i>options</i>)

Prepare behaves almost exactly like `query`, except that it waits until the first `refetch`
to execute the query with the given variables. This is very useful with svelte's reactive declarations.

```html
<script>
  import { getClient, prepare } from 'svelte-apollo';
  import { SEARCH_BY_AUTHOR } from './queries';

  export let author;
  let search = '';

  const client = getClient();
  
  // The books query isn't executed until variables are given via refetch
  // allowing svelte's reactive declarations to be used for variables
  const books = prepare(client, {
    query: SEARCH_BY_AUTHOR
  });

  // `books` is fetched with initial values and then refetched when author or search change
  $: books.refetch({ author, search });
</script>

Author: {author}
<label>Search <input type="text" bind:value={search} /></label>

<ul>
  {#await $books}
    <li>Loading...</li>
  {:then result}
    {#each result.data.books as book (book.id)}
      <li>{book.title}</li>
    {:else}
      <li>No books found</li>
    {/each}
  {/await}
</ul>
```

<a href="#mutate" name="mutate">#</a> <b>mutate</b>(<i>client</i>, <i>options</i>)

Execute a graphql mutation with the Apollo client, using Apollo's [`mutate`](https://www.apollographql.com/docs/react/api/apollo-client.html#ApolloClient.mutate).

```html
<script>
  import { getClient, mutate } from 'svelte-apollo';
  import { ADD_BOOK } from './queries';

  const client = getClient();
  let title = '';
  let author = '';
  let adding = false;

  async function addBook() {
    if (title === '' || author === '') return;

    adding = true;

    try {
      await mutate(client, {
        mutation: ADD_BOOK,
        variables: { title, author }
      });

      title = '';
      author = '';
    } catch(error) {
      // TODO
    } finally {
      adding = false;
    }
  }
</script>

<form on:submit={addBook}>
  <label for="book-author">Author</label>
  <input type="text" id="book-author" bind:value={author} />

  <label for="book-title">Title</label>
  <input type="text" id="book-title" bind:value={title} />

  <button type="submit" disabled={adding}>Add Book</button>
</form>
```

<a href="#subscribe" name="subscribe">#</a> <b>subscribe</b>(<i>client</i>, <i>options</i>)

```html
<script>
  import { getClient, subscribe } from 'svelte-apollo';
  import { NEW_BOOKS } from './queries';

  const client = getClient();
  const new_books = subscribe(client, {
    query: NEW_BOOKS
  });
</script>

{#await $new_books}
  Waiting for new books...
{:then result}
  New Book: {result.data.book}
{/await}
```

<a href="#restore" name="restore">#</a> <b>restore</b>(<i>client</i>, <i>values</i>)

```html
<script context="module">
  import client from './client';
  import gql from 'graphql-tag';

  export async function preload {
    return {
      preloaded: await client.query({
        query: gql`
          ...
        `
      })
    };
  }
</script>

<script>
  import { restore } from 'svelte-apollo';

  export let preloaded;

  // Load preloaded values into client's cache
  restore(client, preloaded);
</script>
```

<a href="#setClient" name="setClient">#</a> <b>setClient</b>(<i>setClient</i>)

Set an Apollo client for the current component's and all child components' contexts.

```html
<!-- Parent.svelte -->
<script>
  import { setClient } from 'svelte-apollo';
  import client from './client';

  setClient(client);
</script>
```

<a href="#getClient" name="getClient">#</a> <b>getClient</b>()

Get an Apollo client from the current component's context.

```html
<!-- Child.svelte -->
<script>
  import { getClient } from 'svelte-apollo';

  const client = getClient();
</script>
```

## Sapper / SSR

For Sapper, the recommended approach is to create a top-level query for each route
that encompasses all the data that various components may need for that route.
This query is fetched during preload and then set in Apollo's cache so that the data is ready
for the various components when it's needed.

```html
<!-- routes/settings.html -->
<script context="module">
  import client from '../data/client';
  import gql from 'graphql-tag';

  export async function preload() {
    return {
      cache: await client.query({
        query: gql`
          everything needed for route...
          (cache misses simply fall back to loading)
        `
      })
    }
  }
</script>

<script>
  import { setClient, restore, query } from 'svelte-apollo';
  import Account from '../components/Account.svelte';
  import GET_PREFERENCES from '../data/queries';

  export let cache;
  restore(client, cache);
  setClient(client);

  // query a subset of the preloaded (the rest if for Account)
  const preferences = query(client, GET_PREFERENCES);
</script>

<Account />

{await $preferences}
  Loading won't be shown if preloaded
{:then result}
  ...
{/await}
```

```html
<!-- components/Account -->
<script>
  import { getClient, query } from 'svelte-apollo';
  import { GET_ACCOUNT } from '../data/queries';

  const client = getClient();
  const account = query(client, { query: GET_ACCOUNT });
</script>

{#await $account}
  Loading won't be shown if sufficient data loaded in preload
{:then result}
  ...
{/await}
```
