import { getClient, setClient } from "..";
import { getContext, setContext } from "svelte";

jest.mock("svelte");

test("should get client from context", () => {
	const client = {};

	(getContext as any).mockReturnValue(client);
	expect(getClient()).toBe(client);
});

test("should throw if client has not been set yet", () => {
	(getContext as any).mockReturnValue(undefined);

	expect(() => getClient()).toThrow(/ApolloClient has not been set yet/);
});

test("should set client on context", () => {
	let client: unknown;

	(setContext as any).mockImplementation((key: any, value: unknown) => {
		client = value;
	});
	(getContext as any).mockImplementation(() => client);

	const value: any = {};
	setClient(value);
	expect(getClient()).toBe(value);
});
