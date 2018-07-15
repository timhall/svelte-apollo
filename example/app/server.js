import sirv from 'sirv';
import polka from 'polka';
import sapper from 'sapper';
import compression from 'compression';
import { routes } from './manifest/server.js';
import App from './App.html';

polka() // You can also use Express
  .use(compression({ threshold: 0 }), sirv('assets'), sapper({ routes, App }))
  .listen(process.env.PORT)
  .catch(err => {
    console.log('error', err);
  });
