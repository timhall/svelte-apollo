import { ApolloClient } from "@apollo/client";
import { getContext, setContext } from "svelte";

const CLIENT = typeof Symbol !== "undefined" ? Symbol("client") : "@@client";

export function getClient<TCache = any>(): ApolloClient<TCache> {
	const client = getContext(CLIENT);

	if (!client) {
		throw new Error(
			"ApolloClient has not been set yet, use setClient(new ApolloClient({ ... })) to define it"
		);
	}

	return client;
}

export function setClient<TCache = any>(client: ApolloClient<TCache>): void {
	setContext(CLIENT, client);
}
