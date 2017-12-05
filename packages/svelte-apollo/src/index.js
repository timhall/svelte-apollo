export { default as ApolloProvider } from './provider';

const connections = new WeakMap();

export function graphql(component) {
  const provider = component.store.get('graphql');
  if (!provider) {
    throw new Error(`Missing 'graphql' ApolloProvider instance in store.`)
  }

  return provider;
}

export function connect(component) {
  if (connections.has(component)) {
    throw new Error('Component has already been connected.');
  }

  const provider = graphql(component);

  const subscriptions = [];
  const values = component.get();
  for (const key in values) {
    if (!values[key] || !values[key].__graphql) continue;

    const placeholder = values[key];
    const type = placeholder.__graphql;

    if (type === 'query') {
      subscriptions.push(provider.toQuery(placeholder, component, key));
    }
  }

  const connection = { subscriptions };
  connections.set(component, connection);
}

export function disconnect(component) {
  const connection = connections.get(component);
  if (!connection) {
    throw new Error('Connection not found for component, was this component connected?');
  }

  connection.subscriptions.forEach(subscription => {
    subscription.unsubscribe()
  });
}

export function query(query, options) {
  // Create query placeholder that is evaluated/subscribed during connect
  let fulfill, reject;
  const placeholder = new Promise((f, r) => {
    fulfill = f;
    reject = f;
  });

  return Object.assign(placeholder, {
    __graphql: 'query',
    query,
    options,
    fulfill,
    reject
  });
}

export function prepare(query, options) {
  // Create prepared query that can be evaluated from computed (e.g. for bound variables)
  // TODO
}
