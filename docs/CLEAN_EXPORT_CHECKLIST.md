# Clean Frontend Export Checklist

## SAFE TO INCLUDE:
- `src/` (UI, components, styles, lib)
- `public/` (assets, intro.html)
- `src/lib/i18n.ts` (i18n resources)
- `vite.config.ts`, `tsconfig.json` (Vite/TypeScript config)
- `package.json`, `bun.lock` (Dependencies/scripts)
- `tailwind.config.js` (Design token configuration)
- `docs/` (AI_STUDIO_FRONTEND_HANDOFF.md, FRONTEND_MIGRATION_INVENTORY.md, TEABLE_HANDOFF_PLACEHOLDER.md, CLEAN_EXPORT_CHECKLIST.md, STORAGE_MIGRATION_NOTES.md)

## DO NOT INCLUDE:
- `node_modules/`
- `dist/`
- `.vercel/`
- `.env`, `.env.example`, `*.env`
- Secrets (`TEABLE_API_KEY`, etc.)
- `server.ts`
- API/auth/OTP/session server implementations
- Teable client/provider implementation (replace with mock repository)
- Resend integration
- Stripe server/webhook code
- Diagnostic/debug routes
- Production data exports
