# 1Don3Vies

Landing page informative pour les **primo-donneurs** : vérifier son éligibilité, trouver où donner, et comprendre comment ça se passe — sans compte, sans transaction.

Le public visé est souvent freiné par le manque d’information (douleur, durée, organisation). 1Don3Vies vise trois certitudes en une visite : *puis-je donner ?*, *où ?*, *comment ça se passe ?*.

> Les règles d’éligibilité sont **simplifiées** pour le challenge. Seul un entretien médical professionnel confirme l’aptitude au don.

## Stack

| Couche | Choix |
|---|---|
| UI | React 18, TypeScript, Vite |
| Styles | Tailwind CSS (tokens custom, **pas** de thème shadcn/Radix) |
| Motion | Framer Motion |
| Carte | Leaflet + react-leaflet |
| Routing | react-router-dom (landing `/` + page `/centres`) |
| Données | Fichiers statiques TypeScript — **pas de backend** |

## Partis pris de conception

**Identité visuelle.** Palette bordeaux / ivoire / corail définie en tokens sémantiques (`primary`, `accent`, `background`…), pas un thème UI kit. Typo Fraunces (titres) + Plus Jakarta Sans (corps). Le rouge « don de sang » est volontairement assombri (bordeaux) pour rester rassurant plutôt que clinique ou alarmiste.

**Narration.** Les 8 blocs du brief (C1–C8) sont tous présents. Fusion assumée : *déroulement + préparation* dans une même section (parcours chronologique, puis conseils avant / jour J / pendant / après). *Qui peut / ne peut pas donner* est collé à la FAQ, juste avant les idées reçues — le simulateur reste un outil court, pas un mur de critères.

**Centres au Bénin.** Huit établissements fictifs mais crédibles, sur huit villes (Cotonou, Porto-Novo, Parakou, Abomey-Calavi, Bohicon, Natitingou, Lokossa, Ouidah). Données locales, horaires côté client (`isCenterOpenNow`), carte + géoloc, filtres (ville, type de don, RDV).

**Éligibilité.** Algorithme conforme à l’annexe : 18–65 ans, 50 kg min, délai 3 mois (H) / 4 mois (F), premier don = délai OK, sinon date de prochaine éligibilité, motif bloquant explicite, disclaimer médical.

**Mobile d’abord.** Grilles 2×2, nav basse, paddings resserrés. Desktop : FAQ + formulaire d’inquiétude côte à côte, carte + filtres sticky.

## Structure

```
src/
  sections/          Landing (Hero → Éligibilité → Parcours → Centres → Réserves → Pourquoi → FAQ)
  pages/             /centres (filtres sticky, liste + carte)
  features/          Logique métier (éligibilité, centres, campagnes)
  data/              Centres, campagnes, FAQ, réserves — statiques
  components/        UI + shared (carte, nav, critères)
  i18n/              FR / EN
```

## Démarrage

```bash
pnpm install
pnpm dev
```

Build : `pnpm build` puis `pnpm preview`.

## Scripts qualité

| Commande | Rôle |
|---|---|
| `pnpm lint` | ESLint |
| `pnpm typecheck` | TypeScript `--noEmit` |
| `pnpm test` | Vitest (unitaires + composants) |
| `pnpm test:watch` | Tests en mode watch |
| `pnpm test:coverage` | Couverture v8 |
| `pnpm precommit-check` | Lint + typecheck + tests |

## Livrables

- Dépôt GitHub
- URL de déploiement
- Ce README
- [`PROMPTS.md`](./PROMPTS.md) — outils IA, prompts significatifs, ajustements manuels, limites
