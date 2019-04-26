<script>
	import { client } from './data';
	import { setClient } from '../../';
	import Books, { preload } from './Books.svelte';

	// Approximate sapper preload
	const preloading = preload();

	setClient(client);
</script>

<section>
	<h2>Books</h2>

	{#await preloading}
		<p>Preloading books....</p>
	{:then preloaded}
		<Books {...preloaded} />
	{:catch error}
		<p>Error preloading books: {error}</p>
	{/await}
</section>
