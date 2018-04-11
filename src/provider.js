export default class ApolloProvider {
  constructor(options) {
    const { client } = options;

    if (!client) {
      throw new Error(`'client' is a required option for ApolloProvider.`);
    }

    this.client = client;
  }

  query(query, options) {
    options = Object.assign({ query }, options);
    return this.client.query(options);
  }

  watchQuery(query, options) {
    options = Object.assign({ query }, options);
    return this.client.watchQuery(options);
  }

  mutate(mutation, options) {
    options = Object.assign({ mutation }, options);
    return this.client.mutate(options);
  }

  toQuery(placeholder, component, key) {
    let resolved = false;
    const { query, options, fulfill, reject } = placeholder;

    const subscription = this.watchQuery(query, options).subscribe({
      next: result => {
        if (!resolved) {
          fulfill(result.data);
          resolved = true;
          return;
        }

        const values = { [key]: result.data };
        component.set(values);
      },
      error: error => {
        if (!resolved) {
          reject(error);
          resolved = true;
          return;
        }

        const values = { [key]: Promise.reject(error) };
        component.set(values);
      }
    });

    return subscription;
  }
}
