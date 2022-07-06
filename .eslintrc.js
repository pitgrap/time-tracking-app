module.exports = {
  parser: "@typescript-eslint/parser", // Specifies the ESLint parser
  extends: [
    "react-app",
    "react-app/jest",
    "plugin:react/recommended", // Uses the recommended rules from @eslint-plugin-react
    "plugin:@typescript-eslint/recommended", // Uses the recommended rules from @typescript-eslint/eslint-plugin
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:prettier/recommended",
  ],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
    project: "./tsconfig.json",
    tsconfigRootDir: "./",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  ignorePatterns: [
    "public/",
    "node_nodules/",
    "**.js",
  ],
  "rules": {
    "prettier/prettier": "warn"
  }
};
