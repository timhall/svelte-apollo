import type { RequestHandler } from '@sveltejs/kit';
import {
	graphql,
	GraphQLID,
	GraphQLList,
	GraphQLObjectType,
	GraphQLSchema,
	GraphQLString
} from 'graphql';

const books = [
	{
		id: 1,
		slug: 'in-search-of-lost-time',
		title: 'In Search of Lost Time',
		author: { name: 'Marcel Proust' }
	},
	{
		id: 2,
		slug: 'ulysses',
		title: 'Ulysses',
		author: { name: 'James Joyce' }
	},
	{
		id: 3,
		slug: 'don-quixote',
		title: 'Don Quixote',
		author: { name: 'Miguel de Cervantes' }
	},
	{
		id: 4,
		slug: 'one-hundred-years-of-solitude',
		title: 'One Hundred Years of Solitude',
		author: { name: 'Gabriel Garcia' }
	},
	{
		id: 5,
		slug: 'the-great-gatsby',
		title: 'The Great Gatsby',
		author: { name: 'F. Scott Fitzgerald' }
	},
	{
		id: 6,
		slug: 'moby-dick',
		title: 'Moby Dick',
		author: { name: 'Herman Melville' }
	},
	{
		id: 7,
		slug: 'war-and-peace',
		title: 'War and Peace',
		author: { name: 'Leo Tolstoy' }
	},
	{
		id: 8,
		slug: 'hamlet',
		title: 'Hamlet',
		author: { name: 'William Shakespeare' }
	},
	{
		id: 9,
		slug: 'the-odyssey',
		title: 'The Odyssey',
		author: { name: 'Homer' }
	},
	{
		id: 10,
		slug: 'madame-bovary',
		title: 'Madame Bovary',
		author: { name: 'Gustave Flaubert' }
	}
];

interface GraphQLRequest {
	query: string;
	operationName: string;
	variables: Record<string, unknown>;
}

const Person = new GraphQLObjectType({
	name: 'Person',
	fields: {
		name: { type: GraphQLString }
	}
});

const Book = new GraphQLObjectType({
	name: 'Book',
	fields: {
		id: { type: GraphQLID },
		slug: { type: GraphQLString },
		title: { type: GraphQLString },
		author: { type: Person }
	}
});

const query = new GraphQLObjectType({
	name: 'Query',
	fields: {
		books: {
			type: new GraphQLList(Book),
			args: {
				search: { type: GraphQLString }
			},
			resolve(_source, { search }) {
				if (!search) return books;

				const query = new RegExp(search, 'i');
				return books.filter((book) => query.test(book.title) || query.test(book.author.name));
			}
		},
		book: {
			type: Book,
			args: {
				slug: { type: GraphQLString }
			},
			resolve(_source, { slug }) {
				return books.find((book) => book.slug === slug);
			}
		}
	}
});

const mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		addBook: {
			type: Book,
			args: {
				title: { type: GraphQLString },
				author: { type: GraphQLString }
			},
			resolve(_source, { title, author }) {
				const id = books.length + 1;
				const slug = title.split(' ').join('-').toLowerCase();
				const book = { id, slug, title, author: { name: author } };
				books.push(book);

				return book;
			}
		}
	}
});

const schema = new GraphQLSchema({ query, mutation });

async function processRequest(request: GraphQLRequest): Promise<Response> {
	const { query: source, variables: variableValues, operationName } = request;
	const result = await graphql({ schema, source, variableValues, operationName });

	return new Response(JSON.stringify(result), {
		status: 200,
		headers: { 'content-type': 'application/json' }
	});
}

export const get: RequestHandler = async ({ request }) => {
	const { searchParams } = new URL(request.url);
	const query = searchParams.get('query');
	const operationName = searchParams.get('operationName');
	const variables = searchParams.has('variables') ? JSON.parse(searchParams.get('variables')) : {};

	return await processRequest({ query, operationName, variables });
};

export const post: RequestHandler = async ({ request }) => {
	const body = (await request.json()) as GraphQLRequest;

	return await processRequest(body);
};
