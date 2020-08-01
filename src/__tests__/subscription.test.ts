import { gql, Observable } from "@apollo/client";
import { subscribe } from "..";
import { getClient, setClient } from "../context";
import { getMock } from "../__fixtures__/mock";
import { read } from "../__fixtures__/read";

jest.mock("../context");

const NEW_MESSAGES = gql`
	subscription newMessages {
		message
	}
`;

it("should export subscription", () => {
	expect(typeof subscribe).toBe("function");
});

it("should observe subscription", async () => {
	setClient({
		subscribe() {
			return Observable.of({ data: 1 }, { data: 2 }, { data: 3 });
		},
	} as any);

	const store = subscribe(NEW_MESSAGES);

	const client = getClient();
	expect(client.subscribe).toHaveBeenCalled();

	const [[options]] = getMock(client.subscribe).calls;
	expect(options.query).toBeDefined();

	const values = await read(store);
	expect(values[0].loading).toEqual(true);
	expect(values[1].data).toEqual(1);
	expect(values[2].data).toEqual(2);
	expect(values[3].data).toEqual(3);
});
