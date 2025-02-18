// rollup.config.mjs
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: {
    react: 'src/react.tsx',
    next: 'src/next.tsx'
  },
  external: ['react', 'react-dom', '@headlessui/react'],
  plugins: [
    nodeResolve(),
    commonjs(),
    typescript({ tsconfig: './tsconfig.build.json' })
  ],
  output: [
    {
      dir: 'dist/src',
      format: 'esm',
      entryFileNames: '[name].js',
      sourcemap: true
    },
    {
      dir: 'dist/src',
      format: 'cjs',
      entryFileNames: '[name].cjs.js',
      sourcemap: true
    }
  ]
};
