<script>
	import { ApolloClient, InMemoryCache, gql } from "@apollo/client/core";
	import { setClient, query, mutation } from "svelte-apollo";	

	const client = new ApolloClient({
		cache: new InMemoryCache()
	});
	setClient(client);

	// Query

	const BOOKS = gql`
		query Books($search: String) {
			books(search: $search) {
				id
				slug
				title
				author {
					name
				}
			}
		}
	`;

	let search;
	const books = query(BOOKS, {
		variables: { search }
	});

	function reload() {
		books.refetch();
	}

	$: books.refetch({ search });

	// Mutation

	const ADD_BOOK = gql`
		mutation AddBook($title: String, $author: String) {
			addBook(title: $title, author: $author) {
				id
				slug
				title
				author {
					name
				}
			}
		}
	`;
	const addBook = mutation(ADD_BOOK);

	function handleSubmit(event) {
		const data = new FormData(event.target);

		(async () => {
			const title = data.get("title");
			const author = data.get("author");

			await addBook({variables: { title, author } });
			
			event.target.reset();

			// TEMP Explicitly refetch
			// (there's probably some way to explicitly update the cache, although search might not match)
			books.refetch({ search });
		})().catch(error => {
			// TODO
			console.error(error);
		})

  }
</script>

<h1>svelte-apollo</h1>

<label>Search <input type="search" bind:value="{search}" /></label>

<ul>
  {#if $books.loading}
    <li>Loading...</li>
  {:else if $books.error}
    <li>ERROR: {$books.error.message}</li>
  {:else}
    {#each $books.data.books as book (book.id)}
      <li>{book.title} by {book.author.name}</li>
    {/each}
  {/if}
</ul>

<button on:click="{reload}">Reload</button>

<hr>

<h2>Add Book</h2>

<form on:submit|preventDefault="{handleSubmit}">
	<label>Title <input type="text" name="title" /></label>
	<label>Author <input type="text" name="author" /></label>

	<button type="submit">Add Book</button>
</form>
