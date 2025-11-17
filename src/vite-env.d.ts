/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string; // your environment variable
  // add more variables here if needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
