// index.d.ts

// Default entry
declare module "tablewind" {
    export * from "./dist/src/react";
    export { default } from "./dist/src/react";
  }
  
  // Sub‑module for Next.js usage
  declare module "tablewind/next" {
    export * from "./dist/src/next";
    export { default } from "./dist/src/next";
  }
  