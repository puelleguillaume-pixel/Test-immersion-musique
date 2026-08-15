/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_CHECKOUT_WEBHOOK_URL?: string;
  readonly VITE_CONTACT_WEBHOOK_URL?: string;
  readonly VITE_INSTAGRAM_HANDLE?: string;
  readonly VITE_GENIUS_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
