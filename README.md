# hemolinkv1

Guide don de sang — SPA React + Vite + TypeScript.

[![Open in Bolt](https://bolt.new/static/open-in-bolt.svg)](https://bolt.new/~/sb1-5h4i8esj)

## Démarrage

```bash
pnpm install
pnpm dev
```

## Scripts qualité

| Commande | Rôle |
|---|---|
| `pnpm lint` | ESLint |
| `pnpm typecheck` | TypeScript `--noEmit` |
| `pnpm precommit-check` | Lint + typecheck (à passer avant chaque commit) |

Avant chaque commit :

```bash
pnpm precommit-check
```
