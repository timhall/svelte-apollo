import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';

export default {
  input: 'src/main.js',
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    file: 'public/bundle.js',
    globals: {
      'apollo-boost': ''
    }
  },
  external: [],
  plugins: [
    svelte({
      dev: true,
      css: css => {
        css.write('public/bundle.css');
      }
    }),
    resolve(),
    commonjs(),
    replace({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ]
};
