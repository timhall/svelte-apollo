const { GraphQLServer } = require("graphql-yoga");

// Source: https://thegreatestbooks.org/
const books = [
	{ id: "1", title: "In Search of Lost Time" },
	{ id: "2", title: "Don Quixote" },
	{ id: "3", title: "Ulysses" },
	{ id: "4", title: "The Great Gatsby" },
	{ id: "5", title: "Moby Dick" },
	{ id: "6", title: "Hamlet" },
	{ id: "7", title: "War and Peace" },
	{ id: "8", title: "The Odyssey" },
	{ id: "9", title: "One Hundred Years of Solitude" },
	{ id: "10", title: "The Divine Comedy" },
];

const typeDefs = `
  type Book {
    id: ID!
    title: String!
  }

  type Query {
    books: [Book!]!
  }
`;

const resolvers = {
	Query: {
		async books() {
			await latency();
			return books;
		},
	},
};

const server = new GraphQLServer({ typeDefs, resolvers });
server.start({ port: 4001, debug: true }, () => {
	console.log("GraphQL server listening on localhost:4001");
});

async function latency(ms = 100) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}
