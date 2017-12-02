export { default as ApolloProvider } from './provider';

export function graphql(context) {
  return this.store.get('graphql');
}
