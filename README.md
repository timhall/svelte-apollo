# svelte-apollo

Svelte integration for Apollo GraphQL.

## Example

The following simple example shows how to run a simple query with svelte-apollo.

```svelte
<!-- App.svelte -->
<Books />

<script>
  import { ApolloClient } from "@apollo/client";
  import { setClient } from "svelte-apollo";
  import Books from "./Books.svelte";

  // 1. Create an Apollo client and pass it to all child components
  //    (uses svelte's built-in context)
  const client = new ApolloClient({
    /* ... */
  });
  setClient(client);
</script>
```

```svelte
<!-- Books.svelte -->
<script>
  import { query } from "svelte-apollo";
  import { GET_BOOKS } from "./queries";

  // 2. Execute the GET_BOOKS GraphQL query using the Apollo client
  //    -> Returns a svelte store of promises that resolve as values come in
  const books = query(GET_BOOKS);
</script>

<!-- 3. Use $books (note the "$"), to subscribe to query values -->
{#if $books.loading}
  Loading...
{:elseif $books.error}
  Error: {$books.error.message}
{:else}
  {#each $books.data.books as book}
    {book.title} by {book.author.name}
  {/each}
{/if}
```

## API

<a href="#query" name="query">#</a> <b>query</b>(<i>document</i>[, <i>options</i>])

Query an Apollo client, returning a readable store of result values.
Uses Apollo's [`watchQuery`](https://www.apollographql.com/docs/react/api/apollo-client.html#ApolloClient.watchQuery),
for fetching from the network and watching the local cache for changes.
If the client is hydrating after SSR, it attempts a `readQuery` to synchronously check the cache for values.

```svelte
<script>
  import { query } from "svelte-apollo";
  import { GET_BOOKS } from "./queries";

  const books = query(GET_BOOKS, {
    // variables, fetchPolicy, errorPolicy, and others
  });

  function reload() {
    books.refetch();
  }
</script>

<ul>
  {#if $books.loading}
    <li>Loading...</li>
  {:elseif $books.error}
    <li>ERROR: {$books.error.message}</li>
  {:else}
    {#each $books.data.books as book (book.id)}
      <li>{book.title} by {book.author.name}</li>
    {/each}
  {/if}
</ul>

<button on:click="{reload}">Reload</button>
```

Reactive variables are supported with `refetch`:

```svelte
<script>
  import { query } from "svelte-apollo";
  import { SEARCH_BY_AUTHOR } from "./queries";

  export let author;
  let search = "";

  const books = query(SEARCH_BY_AUTHOR, {
    variables: { author, search },
  });

  // `books` is refetched when author or search change
  $: books.refetch({ author, search });
</script>

Author: {author}
<label>Search <input type="text" bind:value="{search}" /></label>

<ul>
  {#if $books.loading}
    <li>Loading...</li>
  {:elseif $books.error}
    <li>ERROR: {$books.error.message}</li>
  {:elseif $books.data}
    {#each $books.data.books as book (book.id)}
      <li>{book.title}</li>
    {/each}
  {:else}
    <li>No books found</li>
  {/if}
</ul>
```

<a href="#mutation" name="mutation">#</a> <b>mutation</b>(<i>document</i>[, <i>options</i>])

Prepare a GraphQL mutation with the Apollo client, using Apollo's [`mutate`](https://www.apollographql.com/docs/react/api/apollo-client.html#ApolloClient.mutate).

```svelte
<script>
  import { mutation } from "svelte-apollo";
  import { ADD_BOOK } from "./queries";

  const addBook = mutation(ADD_BOOK);
  let title = "";
  let author = "";

  async function handleSubmit() {
    try {
      await addBook({ variables: { title, author } });
    } catch (error) {
      // TODO
    }
  }
</script>

<form on:submit|preventDefault="{handleSubmit}">
  <label for="book-author">Author</label>
  <input type="text" id="book-author" bind:value="{author}" />

  <label for="book-title">Title</label>
  <input type="text" id="book-title" bind:value="{title}" />

  <button type="submit">Add Book</button>
</form>
```

<a href="#subscribe" name="subscribe">#</a> <b>subscribe</b>(<i>document</i>[, <i>options</i>])

Subscribe using an Apollo client, returning a store that is compatible with `{#await $...}`. Uses Apollo's [`subscribe`](https://www.apollographql.com/docs/react/api/apollo-client#ApolloClient.subscribe).

```svelte
<script>
  import { subscribe } from "svelte-apollo";
  import { NEW_BOOKS } from "./queries";

  const newBooks = subscribe(NEW_BOOKS);
</script>

{#if $newBooks.loading}
  Waiting for new books...
{:elseif $newBooks.data}
  New Book: {$newBooks.data.book}
{/if}
```

<a href="#restore" name="restore">#</a> <b>restore</b>(<i>document</i>, <i>options</i>)

Restore a previously executed query (e.g. via preload) into the Apollo cache.

```svelte
<script context="module">
  import client from "./client";
  import { GET_BOOKS } from "./queries";

  export async function preload() {
    return {
      preloaded: await client.query({ query: GET_BOOKS }),
    };
  }
</script>

<script>
  import { restore } from "svelte-apollo";

  export let preloaded;

  // Load preloaded values into client's cache
  restore(GET_BOOKS, preloaded);
</script>
```

<a href="#setClient" name="setClient">#</a> <b>setClient</b>(<i>client</i>)

Set an Apollo client for the current component's and all child components' contexts.

```svelte
<!-- Parent.svelte -->
<script>
  import { setClient } from "svelte-apollo";
  import client from "./client";

  setClient(client);
</script>
```

<a href="#getClient" name="getClient">#</a> <b>getClient</b>()

Get an Apollo client from the current component's context.

```svelte
<!-- Child.svelte -->
<script>
  import { getClient } from "svelte-apollo";

  const client = getClient();
</script>
```
