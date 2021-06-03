import { gql } from "@apollo/client/core";
import { getClient, mutation, setClient } from "..";
import { getMock, MockClient } from "../__fixtures__/mock";

jest.mock("../context");

it("should export mutation", () => {
	expect(typeof mutation).toBe("function");
});

it("should call client mutate", async () => {
	setClient({ mutate: () => Promise.resolve(42) } as MockClient);

	const mutate = mutation(gql`
		mutation sendMessage($message: String!) {
			sendMessage(message: $message) {
				messages
			}
		}
	`);

	const client = getClient();
	const result = await mutate({ variables: { message: "Howdy!" } });

	expect(result).toEqual(42);

	const [[options]] = getMock(client.mutate).calls;

	expect(options.mutation).toBeDefined();
	expect(options.variables).toEqual({ message: "Howdy!" });
});
