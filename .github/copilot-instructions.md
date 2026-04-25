# Copilot Instructions for time-tracking

This file provides guidelines and instructions for using GitHub Copilot and similar AI coding assistants in this repository. It ensures that AI-generated code aligns with the project's standards, structure, and best practices.

## Tooling and Versions
- **Node.js:** Use Node.js v24 (see `package.json` and GitHub Actions).
- **pnpm:** Use pnpm v10 for all dependency management and scripts.
- **Vite:** The project uses Vite for development and builds (`vite.config.ts`).
- **ESLint & Prettier:** Code must pass linting and formatting checks using ESLint and Prettier (see `eslint.config.mjs`).

## Dependency Management
- Use `pnpm install` to install dependencies.
- Add new dependencies with `pnpm add <package>`.
- All dependencies and devDependencies must be declared in `package.json`.
- Regularly update dependencies and check for vulnerabilities.

## Scripts
- **Start:** `pnpm start` (runs Vite dev server)
- **Build:** `pnpm build` (TypeScript build and Vite production build)
- **Lint:** `pnpm lint` (checks lint issues, used in CI), `pnpm lint --fix` (fixes lint issues)
- **Deploy:** `pnpm run deploy` (builds and deploys to GitHub Pages)

## CI/CD
- All code must pass the GitHub Actions workflows in `.github/workflows/` (see `build.yml` and `deploy.yml`).
- The CI uses Node.js v24 and pnpm v10.
- Linting is enforced in CI (`pnpm lint`).

## Coding Standards
- **TypeScript First:** All code must be TypeScript. Use type annotations and interfaces.
- **React:** Use functional components and React hooks. Do not use class components.
- **i18n:** All user-facing text must use the i18n setup in `src/i18n/`.
- **No Hardcoded Secrets:** Never commit secrets, credentials, or sensitive data.
- **Testing:** If adding new logic, suggest or add tests if possible. (No dedicated test folder yet.)

## File Placement
- **UI Components:** `src/components/`
- **Context Providers:** `src/contexts/`
- **Models/Types:** `src/models/`
- **Utilities:** `src/utils/`
- **Assets:** `src/assets/` or `src/components/assets/` as appropriate
- **Translations:** `src/i18n/`

## Documentation
- Update `README.md` for new features, breaking changes, or setup instructions.
- Update `CHANGELOG.md` for every user-facing change, dependency update, or feature.

## Commit Messages
- Use clear, concise commit messages that describe the change.
- Reference issues or feature requests when applicable.

## Pull Requests
- Ensure all code passes linting and builds successfully.
- Provide a summary of changes and testing steps.
- Request review from at least one other contributor.

## Security
- Do not introduce new CVEs. 
- If a dependency has a known CVE, update it to the patched version.

## Additional Notes
- For CSV export, use the custom implementation in `src/components/ExportCSV.tsx`.
- For time tracking logic, refer to `src/utils/Time.ts` and `src/utils/TrackingStorage.ts`.
- For settings and app-wide state, use the context providers in `src/contexts/`.
