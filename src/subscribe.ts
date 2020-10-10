import type { SubscriptionOptions } from "@apollo/client";
import type { DocumentNode } from "graphql";
import { getClient } from "./context";
import { observableToReadable } from "./observable";
import type { ReadableResult } from "./observable";

export function subscribe<TData = unknown, TVariables = unknown>(
	query: DocumentNode,
	options: Omit<SubscriptionOptions<TVariables>, "query"> = {}
): ReadableResult<TData> {
	const client = getClient();
	const observable = client.subscribe<TData, TVariables>({ query, ...options });

	return observableToReadable<TData>(observable);
}
