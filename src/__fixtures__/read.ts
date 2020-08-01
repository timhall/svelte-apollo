import { Readable } from "svelte/store";

export async function read<TValue = any>(
	store: Readable<TValue>
): Promise<TValue[]> {
	const results: TValue[] = [];
	const unsubscribe = store.subscribe((value) => results.push(value));

	await tick();

	unsubscribe();
	return results;
}

async function tick() {
	return new Promise((resolve) => {
		setTimeout(resolve, 1);
	});
}
