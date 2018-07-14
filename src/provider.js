export default class ApolloProvider {
  constructor(options = {}) {
    const { client } = options;

    if (!client) {
      throw new Error(`"client" is a required option for ApolloProvider`);
    }

    this.client = client;
  }

  query(graphql, options) {
    // TODO
  }

  subscribe(graphql, options) {
    // TODO
  }

  mutate(graphql, options) {
    // TODO
  }
}
