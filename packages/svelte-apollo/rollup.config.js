import replace from 'rollup-plugin-replace';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import filesize from 'rollup-plugin-filesize';
import buble from 'rollup-plugin-buble';
import uglify from 'rollup-plugin-uglify';

// const production = process.env.NODE_ENV
//   ? process.env.NODE_ENV === 'production'
//   : !process.env.ROLLUP_WATCH;
const production = false;

export default {
  input: 'src/index.js',
  output: [
    {
      sourcemap: true,
      format: 'umd',
      file: 'umd/svelte-apollo.js'
    }, {
      sourcemap: true,
      format: 'es',
      file: 'es/svelte-apollo.js'
    }
  ],
  name: 'SvelteApollo',
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify(
        production ? 'production' : 'development'
      )
    }),

    resolve(),
    commonjs(),
    filesize(),

    production && buble({ exclude: 'node_modules/**' }),
    production && uglify()
  ],

  watch: {
    chokidar: true
  }
};
