import { ApolloClient, DataProxy, OperationVariables } from "@apollo/client";
import { DocumentNode } from "graphql";
import { onMount } from "svelte";
import { getClient } from "./context";

export type Restoring<TCache> =
	| WeakSet<ApolloClient<TCache>>
	| Set<ApolloClient<TCache>>;

export const restoring: Restoring<any> =
	typeof WeakSet !== "undefined" ? new WeakSet() : new Set();

export function restore<TData = any, TVariables = OperationVariables>(
	query: DocumentNode,
	options: Omit<DataProxy.WriteQueryOptions<TData, TVariables>, "query">
): void {
	const client = getClient();

	restoring.add(client);
	afterHydrate(() => restoring.delete(client));

	client.writeQuery({ query, ...options });
}

function afterHydrate(callback: () => void): void {
	// Attempt to wait for onMount (hydration of current component is complete),
	// but if that fails (e.g. outside of component initialization)
	// wait for next event loop for hydrate to complete

	try {
		onMount(callback);
	} catch (_error) {
		setTimeout(callback, 1);
	}
}
