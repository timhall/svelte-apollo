import replace from 'rollup-plugin-replace';
import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import filesize from 'rollup-plugin-filesize';

const production = false;

export default {
  input: 'src/main.js',
  output: {
    sourcemap: true,
    format: 'iife',
    file: 'public/bundle.js'
  },
  name: 'app',
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify(
        production ? 'production' : 'development'
      )
    }),

    svelte({
      dev: !production,
      css: css => {
        css.write('public/bundle.css');
      },
      cascade: false,
      hydratable: true,
      store: true
    }),

    resolve(),
    commonjs(),

    babel({
      include: ['node_modules/graphql/**']
    }),

    filesize()
  ],

  watch: {
    chokidar: true
  }
};
