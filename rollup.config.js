import filesize from 'rollup-plugin-filesize';
import buble from 'rollup-plugin-buble';

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/svelte-apollo.umd.js',
      format: 'umd',
      name: 'svelteApollo',
      sourcemap: true,
      globals: {
        'svelte-observable': 'svelteObservable'
      }
    }
  ],
  external: ['svelte-observable'],
  plugins: [filesize(), buble()],

  watch: {
    chokidar: true
  }
};
