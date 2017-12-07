import { __DEV__ } from './utils';

export { default as ApolloProvider } from './provider';

const connections = new WeakMap();

export function graphql(component) {
  const provider = component.store && component.store.get('graphql');

  if (!provider) {
    throw new Error(`'graphql' ApolloProvider not found in store.`);
  }

  return provider;
}

export function connect(component) {
  // oncreate: connect is supported by accepting 'this' as component
  component = component || this;

  if (connections.has(component)) {
    if (__DEV__) {
      console.warn(
        `Component has already been connected to graphql. 'connect' should only be called once per component, typically in 'oncreate'.`
      );
    }

    return;
  }

  const subscriptions = [];
  const provider = graphql(component);
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
  component = component || this;
  const connection = connections.get(component);

  if (!connection) {
    if (__DEV__) {
      console.warn(`Attempted to disconnect component that has not been connected to graphql.`);
    }

    return;
  }

  connection.subscriptions.forEach(subscription => {
    subscription.unsubscribe();
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

export function mutate(mutation, options) {
  // Create mutation function for use in methods
  return async function() {
    const provider = graphql(this);
    const query =
      typeof mutation === 'function'
        ? await mutation.apply(this, arguments)
        : mutation;

    await provider.mutate(query, options);
  };
}
