import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import json from "@eslint/json";
import { defineConfig } from "eslint/config";

const JS_FILES = ["**/*.{js,mjs,cjs,jsx}"];
const TS_FILES = ["**/*.{ts,mts,cts,tsx}"];
const JS_TS_FILES = ["**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}"];

export default defineConfig([
  {
    ignores: [
      "**/.next/**",
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/out/**",
      "**/coverage/**",
      "**/next-env.d.ts",
    ],
  },
  {
    files: JS_FILES,
    ...js.configs.recommended,
  },
  ...tseslint.configs.recommended.map((cfg) =>
    Object.hasOwn(cfg, "files") ? cfg : { ...cfg, files: TS_FILES },
  ),
  {
    files: JS_TS_FILES,
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
  {
    files: JS_TS_FILES,
    ...pluginReact.configs.flat.recommended,
    settings: {
      react: { version: "detect" },
    },
    rules: {
      ...pluginReact.configs.flat.recommended.rules,
      // Next.js + React 17+ new JSX transform
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
    },
  },
  {
    files: ["**/*.json"],
    plugins: { json },
    language: "json/json",
    extends: ["json/recommended"],
  },
]);
