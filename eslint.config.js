import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      quotes: [
        "error",
        "double",
        {
          avoidEscape: true,
        },
      ],
      "no-console": "warn",
      "@typescript-eslint/no-explicit-any": "off",
      "comma-dangle": ["error", "always-multiline"], //  enforces the use of a trailing comma in objects, arrays, etc..
      "react-hooks/rules-of-hooks": "error", // ensures that effect dependencies are specified correctly for React hooks
      "react-hooks/exhaustive-deps": "error", // enforces the use of effect dependencies in React hooks
    },
  }
);
