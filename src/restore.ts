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
	data: TData
): void;
export function restore<TData = any, TVariables = OperationVariables>(
	options: DataProxy.WriteQueryOptions<TData, TVariables>
): void;
export function restore<TData = any, TVariables = OperationVariables>(
	maybeQuery: DocumentNode | DataProxy.WriteQueryOptions<TData, TVariables>,
	maybeData?: TData
): void {
	const client = getClient();

	restoring.add(client);
	afterHydrate(() => restoring.delete(client));

	const options = isWriteQueryOptions(maybeQuery)
		? maybeQuery
		: { query: maybeQuery, data: maybeData };

	client.writeQuery(options);
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

function isWriteQueryOptions(
	value: any
): value is DataProxy.WriteQueryOptions<any, any> {
	return value && value.query;
}
