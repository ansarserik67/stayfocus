import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // The react-hooks v7 "set-state in effect" heuristic flags patterns that
    // are required here: SSR-safe localStorage hydration (theme, language,
    // auth) and the countdown/breathing timers in the dashboard. Kept as
    // warnings so they stay visible without failing the build.
    rules: {
      "react-hooks/set-state-in-effect": "warn",
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Vendored MediaPipe WASM bundle and pose model: generated artefacts that
    // happen to be .js/.json, not project source.
    "public/mediapipe/**",
  ]),
]);

export default eslintConfig;
