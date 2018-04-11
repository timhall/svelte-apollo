# sapper-template

The default [Sapper](https://github.com/sveltejs/sapper) template. To clone it and get started:

```bash
npx degit sveltejs/sapper-template my-app
cd my-app
npm install # or yarn!
npm run dev
```

Open up [localhost:3000](http://localhost:3000) and start clicking around.


## Structure

Sapper expects to find three directories in the root of your project — `assets`, `routes` and `templates`.


### assets

The [assets](assets) directory contains any static assets that should be available. These are served using [serve-static](https://github.com/expressjs/serve-static).

In your [service-worker.js](app/service-worker.js) file, you can import these as `assets` from the generated manifest...

```js
import { assets } from './manifest/service-worker.js';
```

...so that you can cache them (though you can choose not to, for example if you don't want to cache very large files).


### routes

This is the heart of your Sapper app. There are two kinds of routes — *pages*, and *server routes*.

**Pages** are Svelte components written in `.html` files. When a user first visits the application, they will be served a server-rendered version of the route in question, plus some JavaScript that 'hydrates' the page and initialises a client-side router. From that point forward, navigating to other pages is handled entirely on the client for a fast, app-like feel. (Sapper will preload and cache the code for these subsequent pages, so that navigation is instantaneous.)

**Server routes** are modules written in `.js` files, that export functions corresponding to HTTP methods. Each function receives Express `request` and `response` objects as arguments, plus a `next` function. This is useful for creating a JSON API, for example.

There are three simple rules for naming the files that define your routes:

* A file called `routes/about.html` corresponds to the `/about` route. A file called `routes/blog/[slug].html` corresponds to the `/blog/:slug` route, in which case `params.slug` is available to the route
* The file `routes/index.html` (or `routes/index.js`) corresponds to the root of your app. `routes/about/index.html` is treated the same as `routes/about.html`.
* Files and directories with a leading underscore do *not* create routes. This allows you to colocate helper modules and components with the routes that depend on them — for example you could have a file called `routes/_helpers/datetime.js` and it would *not* create a `/_helpers/datetime` route


### templates

This directory should contain the following files at a minimum:

* [app/client.js](app/client.js) — this module initialises Sapper
* [app/service-worker.js](app/service-worker.js) — your app's service worker
* [app/template.html](app/template.html) — a template for the page to serve for valid requests
* [routes/4xx.html](routes/4xx.html) — a template for 4xx-range errors (such as 404 Not Found)
* [routes/5xx.html](routes/5xx.html) — a template for 5xx-range errors (such as 500 Internal Server Error)

Inside the HTML templates, Sapper will inject various values as indicated by `%sapper.xxxx%` tags. Inside JavaScript files, Sapper will replace strings like `__dev__` with the appropriate value.

In lieu of documentation (bear with us), consult the files to see what variables are available and how they're used.


## Webpack config

Sapper uses webpack to provide code-splitting, dynamic imports and hot module reloading, as well as compiling your Svelte components. As long as you don't do anything daft, you can edit the configuration files to add whatever loaders and plugins you'd like.


## Production mode and deployment

To start a production version of your app, run `npm run build && npm start`. This will disable hot module replacement, and activate the appropriate webpack plugins.

You can deploy your application to any environment that supports Node 8 or above. As an example, to deploy to [Now](https://zeit.co/now), run these commands:

```bash
npm install -g now
now
```


## Bugs and feedback

Sapper is in early development, and may have the odd rough edge here and there. Please be vocal over on the [Sapper issue tracker](https://github.com/sveltejs/sapper/issues).


## License

[LIL](LICENSE)
