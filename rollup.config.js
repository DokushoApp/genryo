import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/dokusho-extensions.js',
      format: 'iife',
      name: 'DokushoExtensions',
      sourcemap: true,
    },
    {
      file: 'dist/dokusho-extensions.min.js',
      format: 'iife',
      name: 'DokushoExtensions',
      plugins: [terser()],
      sourcemap: true,
    },
    {
      file: 'dist/dokusho-extensions.esm.js',
      format: 'es',
      sourcemap: true,
    }
  ],
  plugins: [
    resolve({
      browser: true,
    }),
    commonjs(),
    json(),
  ],
  // This ensures all dependencies like axios are bundled
  external: []
};