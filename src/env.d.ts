/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_COUNTDOWN_TARGET: string
  readonly VITE_COUNTDOWN_EVENT: string
  readonly VITE_COUNTDOWN_TIMEZONE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
