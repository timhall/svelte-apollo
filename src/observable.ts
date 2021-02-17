import { ApolloError } from "@apollo/client/core";
import type { FetchResult, Observable, ObservableQuery } from "@apollo/client";
import { readable } from "svelte/store";
import { Readable } from "svelte/store";

// Match Apollo's hook approach, by returning a result with three states:
// loading, error, or data (where data could be null / undefined)

export interface Loading {
	loading: true;
	data?: undefined;
	error?: undefined;
}
export interface ReadableError {
	loading: false;
	data?: undefined;
	error: ApolloError | Error;
}
export interface Data<TData = unknown> {
	loading: false;
	data: TData | null | undefined;
	error?: undefined;
}

export type Result<TData = unknown> = Loading | ReadableError | Data<TData>;

// Some methods, e.g. subscription, use Observable<FetchResult>,
// convert this more raw value to a readable

export type ReadableResult<TData = unknown> = Readable<Result<TData>>;

export function observableToReadable<TData = unknown>(
	observable: Observable<FetchResult<TData>>,
	initialValue: Result<TData> = {
		loading: true,
		data: undefined,
		error: undefined,
	}
): ReadableResult<TData> {
	const store = readable<Result<TData>>(initialValue, (set) => {
		const skipDuplicate = initialValue?.data !== undefined;
		let skipped = false;

		const subscription = observable.subscribe(
			(result) => {
				if (skipDuplicate && !skipped) {
					skipped = true;
					return;
				}

				if (result.errors) {
					const error = new ApolloError({ graphQLErrors: result.errors });
					set({ loading: false, data: undefined, error });
				} else {
					set({ loading: false, data: result.data, error: undefined });
				}
			},
			(error) => set({ loading: false, data: undefined, error })
		);

		return () => subscription.unsubscribe();
	});

	return store;
}

// For live queries, ObservableQuery is used, adding methods like refetch
// extend readable with these methods

export interface ObservableQueryExtensions<TData = unknown> {
	fetchMore: ObservableQuery<TData>["fetchMore"];
	getCurrentResult: ObservableQuery<TData>["getCurrentResult"];
	getLastError: ObservableQuery<TData>["getLastError"];
	getLastResult: ObservableQuery<TData>["getLastResult"];
	isDifferentFromLastResult: ObservableQuery<TData>["isDifferentFromLastResult"];
	refetch: ObservableQuery<TData>["refetch"];
	resetLastResults: ObservableQuery<TData>["resetLastResults"];
	resetQueryStoreErrors: ObservableQuery<TData>["resetQueryStoreErrors"];
	result: ObservableQuery<TData>["result"];
	setOptions: ObservableQuery<TData>["setOptions"];
	setVariables: ObservableQuery<TData>["setVariables"];
	startPolling: ObservableQuery<TData>["startPolling"];
	stopPolling: ObservableQuery<TData>["stopPolling"];
	subscribeToMore: ObservableQuery<TData>["subscribeToMore"];
	updateQuery: ObservableQuery<TData>["updateQuery"];
}

export const extensions: Array<keyof ObservableQueryExtensions> = [
	"fetchMore",
	"getCurrentResult",
	"getLastError",
	"getLastResult",
	"isDifferentFromLastResult",
	"refetch",
	"resetLastResults",
	"resetQueryStoreErrors",
	"result",
	"setOptions",
	"setVariables",
	"startPolling",
	"stopPolling",
	"subscribeToMore",
	"updateQuery",
];

export type ReadableQuery<TData> = ReadableResult<TData> &
	ObservableQueryExtensions<TData>;

export function observableQueryToReadable<
	TData = unknown,
	TVariables = unknown
>(
	query: ObservableQuery<TData, TVariables>,
	initialValue?: Result<TData>
): ReadableQuery<TData> {
	const store = observableToReadable(query, initialValue) as ReadableQuery<
		TData
	>;

	for (const extension of extensions) {
		store[extension] = query[extension].bind(query) as any;
	}

	return store;
}
