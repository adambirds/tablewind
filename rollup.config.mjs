// rollup.config.mjs
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  // Specify multiple entry points using an object
  input: {
    react: 'src/react.tsx',
    next: 'src/next.tsx'
  },
  // Mark peer dependencies and other externals
  external: ['react', 'react-dom', '@headlessui/react'],
  plugins: [
    nodeResolve(),
    commonjs(),
    typescript({ tsconfig: './tsconfig.build.json' })
  ],
  // Generate both ESM and CommonJS outputs
  output: [
    {
      // ESM build
      dir: 'dist/src',
      format: 'esm',
      entryFileNames: '[name].js',
      sourcemap: true
    },
    {
      // CommonJS build
      dir: 'dist/src',
      format: 'cjs',
      entryFileNames: '[name].cjs.js',
      sourcemap: true
    }
  ]
};
