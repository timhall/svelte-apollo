import { mockObservableQuery } from "../__fixtures__/mock";
import { jest } from "@jest/globals";

export interface MockApolloClient {
	watchQuery: any;
	readQuery: any;
	writeQuery: any;
	mutate: any;
	subscribe: any;
}

let client: MockApolloClient;
setClient();

export function getClient() {
	return client;
}

export function setClient(options: Partial<MockApolloClient> = {}) {
	const {
		watchQuery = () => mockObservableQuery({ data: {} }),
		readQuery,
		writeQuery,
		mutate,
		subscribe,
	} = options;

	client = {
		watchQuery: jest.fn(watchQuery),
		readQuery: jest.fn(readQuery),
		writeQuery: jest.fn(writeQuery),
		mutate: jest.fn(mutate),
		subscribe: jest.fn(subscribe),
	};

	return client;
}
