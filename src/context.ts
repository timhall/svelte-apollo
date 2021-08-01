import type { ApolloClient } from "@apollo/client";

let globalClient: ApolloClient<any>

export function getClient<TCache = any>(): ApolloClient<TCache> {
	const client = globalClient;

	if (!client) {
		throw new Error(
			"ApolloClient has not been set yet, use setClient(new ApolloClient({ ... })) to define it"
		);
	}

	return client as ApolloClient<TCache>;
}

export function setClient<TCache = any>(client: ApolloClient<TCache>): void {
	globalClient = client
}