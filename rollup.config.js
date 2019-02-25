import typescript from 'rollup-plugin-typescript';
import dts from 'rollup-plugin-dts';
import filesize from 'rollup-plugin-filesize';

const external = [
  'graphql',
  'apollo-client',
  'apollo-utilities',
  'svelte',
  'svelte/store',
  'svelte-observable'
];

export default [
  {
    input: 'src/index.ts',
    external,
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
    plugins: [typescript(), filesize()]
  },
  {
    input: 'src/index.ts',
    external,
    output: {
      file: 'dist/svelte-apollo.d.ts',
      format: 'es'
    },
    plugins: [dts()]
  }
];
