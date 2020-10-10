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
export interface Error {
	loading: false;
	data?: undefined;
	error: ApolloError | Error;
}
export interface Data<TData = unknown> {
	loading: false;
	data: TData | null | undefined;
	error?: undefined;
}

export type Result<TData = unknown> = Loading | Error | Data<TData>;

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

export interface ObservableQueryExtensions {
	fetchMore: ObservableQuery["fetchMore"];
	getCurrentResult: ObservableQuery["getCurrentResult"];
	getLastError: ObservableQuery["getLastError"];
	getLastResult: ObservableQuery["getLastResult"];
	isDifferentFromLastResult: ObservableQuery["isDifferentFromLastResult"];
	refetch: ObservableQuery["refetch"];
	resetLastResults: ObservableQuery["resetLastResults"];
	resetQueryStoreErrors: ObservableQuery["resetQueryStoreErrors"];
	result: ObservableQuery["result"];
	setOptions: ObservableQuery["setOptions"];
	setVariables: ObservableQuery["setVariables"];
	startPolling: ObservableQuery["startPolling"];
	stopPolling: ObservableQuery["stopPolling"];
	subscribeToMore: ObservableQuery["subscribeToMore"];
	updateQuery: ObservableQuery["updateQuery"];
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
	ObservableQueryExtensions;

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
