import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  // Presets Next.js (via compat)
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Override: autoriser `any` uniquement dans lib/
  {
    files: ["lib/**/*.ts", "lib/**/*.tsx"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",

    },
  },
];
