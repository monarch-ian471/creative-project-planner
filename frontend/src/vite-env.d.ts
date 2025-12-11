/// <reference types="vite/client" />

interface ImportMetaEnv {
    VITE_BASE_URL: string; // Add any other environment variables you use
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  