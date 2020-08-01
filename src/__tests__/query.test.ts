import { gql } from "@apollo/client";
import { get } from "svelte/store";
import { getClient, query, setClient } from "..";
import { Result } from "../observable";
import { restoring } from "../restore";
import { getMock, MockClient, mockObservableQuery } from "../__fixtures__/mock";
import { read } from "../__fixtures__/read";

jest.mock("../context");

const MESSAGE_BY_ID = gql`
	query messageById($id: Int!) {
		messageById(id: $id) {
			message
		}
	}
`;

it("should export query", () => {
	expect(typeof query).toBe("function");
});

it("should call watchQuery with options", async () => {
	setClient({ mutate: () => Promise.resolve(42) } as MockClient);

	const store = query(MESSAGE_BY_ID, { variables: { id: 1 } });

	const values = await read<Result<any>>(store);
	expect(values[0].loading).toBe(true);
	expect(values[1].data).toEqual({});

	const client = getClient();
	const [[options]] = getMock(client.watchQuery).calls;

	expect(options.query).toBeDefined();
	expect(options.variables).toEqual({ id: 1 });
});

it("should expose ObservableQuery functions", () => {
	const store = query(MESSAGE_BY_ID, { variables: { id: 2 } });

	expect(typeof store.fetchMore).toBe("function");
	expect(typeof store.getCurrentResult).toBe("function");
	expect(typeof store.getLastError).toBe("function");
	expect(typeof store.isDifferentFromLastResult).toBe("function");
	expect(typeof store.refetch).toBe("function");
	expect(typeof store.resetLastResults).toBe("function");
	expect(typeof store.resetQueryStoreErrors).toBe("function");
	expect(typeof store.result).toBe("function");
	expect(typeof store.setOptions).toBe("function");
	expect(typeof store.setVariables).toBe("function");
	expect(typeof store.startPolling).toBe("function");
	expect(typeof store.stopPolling).toBe("function");
	expect(typeof store.subscribeToMore).toBe("function");
	expect(typeof store.updateQuery).toBe("function");
});

describe("restore", () => {
	it("should not attempt readQuery if not restoring", () => {
		const store = query(MESSAGE_BY_ID, { variables: { id: 3 } });

		const client = getClient();
		expect(client.readQuery).not.toHaveBeenCalled();
	});

	it("should attempt readQuery if restoring", () => {
		const client = getClient();
		restoring.add(client);

		const store = query(MESSAGE_BY_ID, { variables: { id: 4 } });

		expect(client.readQuery).toHaveBeenCalled();

		const [[options]] = getMock(client.readQuery).calls;
		expect(options.query).toBeDefined();
		expect(options.variables).toEqual({ id: 4 });
	});

	it("should have initial synchronous value from readQuery", async () => {
		const initial = { data: { message: "Howdy" } };
		setClient({
			readQuery: () => initial,
			watchQuery: () => mockObservableQuery(initial),
		} as MockClient);

		const client = getClient();
		restoring.add(client);

		const store = query(MESSAGE_BY_ID, { variables: { id: 5 } });
		const initialValue = get(store);

		expect(initialValue).toEqual(initial);
	});

	it("should not have duplicate value when using readQuery", async () => {
		const initial = { data: { name: "Tim" } };
		setClient({
			readQuery: () => initial,
			watchQuery: () => mockObservableQuery(initial),
		} as MockClient);

		const client = getClient();
		restoring.add(client);

		const store = query(MESSAGE_BY_ID, { variables: { id: 6 } });
		const values = await read(store);

		expect(values.length).toEqual(1);
	});

	it("should swallow errors from readQuery", async () => {
		setClient({
			readQuery: () => {
				throw new Error("(swallowed)");
			},
		} as MockClient);

		const client = getClient();
		restoring.add(client);

		const store = query(MESSAGE_BY_ID, { variables: { id: 7 } });

		expect(client.readQuery).toHaveBeenCalled();

		const [[options]] = getMock(client.readQuery).calls;
		expect(options.query).toBeDefined();
		expect(options.variables).toEqual({ id: 7 });
	});
});
