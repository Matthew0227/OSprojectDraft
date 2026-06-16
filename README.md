# OS Learning Site

Minimal Next.js + TypeScript starter for Operating Systems learning modules.

## Setup

Install dependencies and run the dev server:

```powershell
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

## Notes
- This is a minimal scaffold. Add lecture notes, diagrams, and quizzes inside the pages for each module (`/pages/module4.tsx`, etc.).
- To deploy, use Vercel or other Next.js hosting providers.

## Node modules and lockfile

- The `node_modules/` folder contains installed packages required to run and build the site. It is intentionally ignored in the repo (`.gitignore`) and should not be committed.
- Keep `package.json` and `package-lock.json` (or other lockfiles) in the repository — they lock dependency versions for reproducible installs.

## Common commands

- Install dependencies:

```powershell
cd "C:\Users\Matteoo\OneDrive\Desktop\Codes\OSprojectDraft"
npm install
```

- Start dev server:

```powershell
npm run dev
```

- Build and run production locally:

```powershell
npm run build
npm start
```

If PowerShell blocks running scripts on your machine, run the same `npm` commands from Command Prompt (`cmd.exe`) or use Git Bash/WSL. To temporarily bypass PowerShell's execution policy for the current session:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
npm install
```

## Security and audits

Run `npm audit` to review known vulnerabilities. Try `npm audit fix` to apply non-breaking fixes. Use `npm audit fix --force` only after reviewing breaking changes.
