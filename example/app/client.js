import { init } from 'sapper/runtime.js';
import { routes } from './manifest/client.js';
import App from './App.html';

init({
  target: document.querySelector('#sapper'),
  routes,
  App
});
