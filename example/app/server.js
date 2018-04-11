import polka from 'polka';
import compression from 'compression';
import sapper from 'sapper';
import serve from 'serve-static';
import { routes } from './manifest/server.js';
import { Store } from 'svelte/store';

polka() // You can also use Express
  .use(
    compression({ threshold: 0 }),
    serve('assets'),
    sapper({ routes, store: req => new Store({}) })
  )
  .listen(process.env.PORT);
