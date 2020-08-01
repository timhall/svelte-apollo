import { gql } from "@apollo/client";
import { restore } from "..";
import { getClient, setClient } from "../context";
import { restoring } from "../restore";
import { getMock } from "../__fixtures__/mock";

jest.mock("../context");

const MESSAGES = gql`
	query messages {
		message
	}
`;

it("should export restore", () => {
	expect(typeof restore).toBe("function");
});

it("should add client to restoring set", () => {
	setClient({} as any);
	restore(MESSAGES, { data: { messages: [] } });

	const client = getClient();
	expect(restoring.has(client)).toEqual(true);
});

it("should call client writeQuery", () => {
	setClient({} as any);
	restore(MESSAGES, { data: { messages: [] } });

	const client = getClient();
	expect(client.writeQuery).toBeCalled();

	const [[options]] = getMock(client.writeQuery).calls;
	expect(options.query).toBeDefined();
	expect(options.data).toEqual({ messages: [] });
});
