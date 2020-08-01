import { getClient, setClient } from "..";

it("should export setClient", () => {
	expect(typeof setClient).toBe("function");
});

it("should export getClient", () => {
	expect(typeof getClient).toBe("function");
});
