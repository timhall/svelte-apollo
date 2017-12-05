const { join } = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const schema = require('./schema');

// Currently, store is exported as ES Module
const esm = require('@std/esm')(module, { esm: 'js' });
const { Store } = esm('svelte/store');

// Compile component
require('svelte/ssr/register')({ store: true });
const app = require('./src/App.html');

const server = express();
const store = new Store();

server.use('/public', express.static(join(__dirname, 'public')));
server.use('/graphql', bodyParser.json(), graphqlExpress({ schema }))

server.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

server.get('/*', (req, res) => {
  const data = {};
  const html = ''; // TODO app.render(data, { store });

  res.write(`
<!doctype html>
<html>
<head>
  <meta charset='utf8'>
  <meta name='viewport' content='width=device-width'>

  <title>svelte-apollo</title>

  <link rel='stylesheet' href='/public/global.css'>
  <link rel='stylesheet' href='/public/bundle.css'>
</head>

<body>
  <div id="app">${html}</div>
  <script src='https://unpkg.com/zen-observable/zen-observable.js'></script>
  <script src='/public/bundle.js'></script>
</body>
</html>
  `);

  res.end();
});

server.listen(5000, () => console.log('Listening at localhost:5000'));
