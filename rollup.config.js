import buble from 'rollup-plugin-buble';
import filesize from 'rollup-plugin-filesize';

export default {
  input: 'src/index.js',
  external: ['svelte', 'svelte/store', 'svelte-observable'],
  output: [
    {
      file: 'dist/svelte-apollo.es.js',
      format: 'es',
      sourcemap: true
    },
    {
      file: 'dist/svelte-apollo.cjs.js',
      format: 'cjs',
      sourcemap: true
    }
  ],
  plugins: [buble(), filesize()]
};
