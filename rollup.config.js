import filesize from 'rollup-plugin-filesize';
import buble from 'rollup-plugin-buble';

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/svelte-apollo.umd.js',
      format: 'umd',
      name: 'SvelteApollo',
      sourcemap: true
    }
  ],
  plugins: [
    filesize(),
    buble()
  ],

  watch: {
    chokidar: true
  }
};
