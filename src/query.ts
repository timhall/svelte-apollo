import { ApolloQueryResult, WatchQueryOptions } from "@apollo/client";
import { DocumentNode } from "graphql";
import { getClient } from "./context";
import { observableQueryToReadable, ReadableQuery, Result } from "./observable";
import { restoring } from "./restore";

export function query<TData = any, TVariables = any>(
	query: DocumentNode,
	options: Omit<WatchQueryOptions<TVariables>, "query"> = {}
): ReadableQuery<TData> {
	const client = getClient();
	const queryOptions = { ...options, query };

	// If client is restoring (e.g. from SSR), attempt synchronous readQuery first
	let initialValue: ApolloQueryResult<TData> | undefined;
	if (restoring.has(client)) {
		try {
			// undefined = skip initial value (not in cache)
			initialValue = client.readQuery(queryOptions) || undefined;
		} catch (err) {
			// Ignore preload errors
		}
	}

	const observable = client.watchQuery<TData>(queryOptions);
	const store = observableQueryToReadable(
		observable,
		initialValue as Result<TData>
	);

	return store;
}
