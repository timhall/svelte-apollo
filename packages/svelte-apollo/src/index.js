export { default as ApolloProvider } from './provider';

export function graphql(context) {
  return context.store.get('graphql');
}
