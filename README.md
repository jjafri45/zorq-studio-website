# ZORQ Studio Redesign

Dependency-free static redesign for ZORQ Studio.

## Commands

```bash
node scripts/generate-site.mjs
node scripts/check-site.mjs
node scripts/server.mjs
```

Then open `http://localhost:4173/`.

If that port is busy in PowerShell:

```powershell
$env:PORT=4174; node scripts/server.mjs
```

The source lives in `src/`, brand and visual assets live in `public/assets/`, and generated production files are written to `dist/`.
