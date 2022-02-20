import { Observable } from "@apollo/client/core";
import { extensions } from "../observable";
import { jest } from "@jest/globals";

export type Mock = {
	calls: Array<any[]>;
};

export function getMock(value: any): Mock {
	return value.mock;
}

export type MockClient = any;

export function mockObservableQuery(value: any) {
	const query: any = Observable.of(value);

	for (const extension of extensions) {
		query[extension] = jest.fn();
	}

	return query;
}
