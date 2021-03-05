module.exports = {
  env: {
    browser: true,
  },
  globals: {
    process: true,
    module: true,
  },
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:prettier/recommended",
    "prettier/@typescript-eslint",
    "prettier/react",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    project: "./tsconfig.json",
  },
  rules: {
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "react/no-unknown-property": ["error", { ignore: ["class"] }],
    "react/prefer-stateless-function": 1,
    "@typescript-eslint/explicit-module-boundary-types": 0,
    "@typescript-eslint/explicit-function-return-type": 0,
    "@typescript-eslint/no-unnecessary-type-assertion": 0,
    "react/display-name": 0,
    "prettier/prettier": [
      "error",
      {
        trailingComma: "es5",
        tabWidth: 2,
        semi: false,
        singleQuote: true,
        printWidth: 140,
      },
    ],
  },
  settings: {
    react: {
      pragma: "h",
      version: "detect",
    },
  },
  overrides: [
    {
      files: ["*.js"],
      rules: {
        "@typescript-eslint/explicit-function-return-type": "off",
      },
    },
  ],
};
