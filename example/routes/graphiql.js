import { graphiqlExpress } from 'apollo-server-express';
const graphiql = graphiqlExpress({ endpointURL: '/graphql' });

export const get = graphiql;
