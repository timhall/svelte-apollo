import { ApolloError, Observable } from "@apollo/client/core";
import { GraphQLError } from "graphql";
import { Data, observableToReadable } from "../observable";
import { read } from "../__fixtures__/read";

test("should return ApolloError for errors", async () => {
	const readable = observableToReadable(
		Observable.of({ errors: [new GraphQLError("GraphQL Error")] })
	);

	const results = await read(readable);
	expect(results[0].loading).toBe(true);
	expect(results[1].error instanceof ApolloError).toBe(true);
});

test("should return observable error", async () => {
	const readable = observableToReadable(
		new Observable(() => {
			throw new Error("Internal Error");
		})
	);

	const results = await read(readable);
	expect(results[0].loading).toBe(true);
	expect(results[1].error?.toString()).toMatch(/Internal Error/);
});

test("should skip initial loading status, if initial value is given", async () => {
	const readable = observableToReadable(
		Observable.of({ data: 1 }, { data: 2 }, { data: 3 }),
		{ data: 1 } as Data<number>
	);

	const values = (await read(readable)).map((result) => result.data);
	expect(values).toEqual([1, 2, 3]);
});
