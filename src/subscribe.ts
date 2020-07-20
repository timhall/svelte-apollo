import { SubscriptionOptions } from "@apollo/client";
import { DocumentNode } from "graphql";
import { getClient } from "./context";
import { observableToReadable, ReadableResult } from "./observable";

export function subscribe<TData = any, TVariables = any>(
	query: DocumentNode,
	options: Omit<SubscriptionOptions<TVariables>, "query"> = {}
): ReadableResult<TData> {
	const client = getClient();
	const observable = client.subscribe<TData, TVariables>({ query, ...options });

	return observableToReadable<TData>(observable);
}
