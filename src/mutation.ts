import { FetchResult, MutationOptions } from "@apollo/client";
import { DocumentNode } from "graphql";
import { getClient } from "./context";

export type MutateOptions<T = any, TVariables = any> = Omit<
	MutationOptions<T, TVariables>,
	"mutation"
>;

export type Mutate<T = any, TVariables = any> = (
	options: MutateOptions<T, TVariables>
) => Promise<FetchResult<T>>;

export function mutation<T = any, TVariables = any>(
	mutation: DocumentNode
): Mutate<T, TVariables> {
	const client = getClient();

	return (options: MutateOptions<T, TVariables>) =>
		client.mutate({ mutation, ...options });
}
