# PROMPTS.md

Méthodologie IA du projet 1Don3Vies (Figma to Code Challenge, édition 4).  
Document rédigé à partir de l’usage réel, pas d’une reconstruction idéalisée.

## Outils sollicités

| Outil | Rôle |
|---|---|
| **Bolt.new** | Scaffold initial (template `bolt-vite-react-ts`) : SPA React + Vite + TypeScript + Tailwind. Base de départ, pas le produit final. |
| **Cursor** (agent Composer) | Collaborateur principal : implémentation, itération visuelle, logique métier, i18n, carte, a11y. Pilotage par prompts courts + captures d’écran. |

Pas de backend généré. Pas de maquette Figma fournie : la direction produit et l’identité visuelle ont été arbitrées dans le dialogue, pas « générées une fois pour toutes ».

## Séquence des prompts significatifs

Les formulations ci-dessous sont proches des prompts réellement envoyés (parfois condensées). L’IA n’a pas reçu un brief unique : le produit s’est construit par corrections successives.

### 1. Socle et identité

Palette fournie telle quelle (tokens, pas un thème UI kit) :

> primary #8F2346 → Bordeaux principal  
> primary-dark #691735 → Bordeaux sombre  
> accent #E86A5B → Corail  
> background #FAF8F5 → Ivoire  
> …

Puis cadrage lexical :

> restaure comme s'était et change le bordeaux en primary, je ne veux plus bordeaux, je veux le terme primary

Hero et contenu :

> Mettre l'image dotted_world_map.jpeg en fond du hero en diminuant un peu l'opacity  
> Est-ce que je peux donner mon sang ? question interactive (animée), que ça ne s'arrête pas mais durer sur la langue choisie  
> Mettre les points d'interrogation où il faut. Pourquoi donner => pourquoi donner ?

**Arbitrage :** l’IA proposait parfois un vocabulaire « bordeaux » dans le code ; consigne explicite de rester sur des tokens sémantiques (`primary`).

### 2. Direction visuelle (captures, pas de spec)

> Revois le design. Toi aussi fais un effort de rendu  
> Inspire toi de tout ce qui était sur l'image. que ce soit le format téléphone, la goutte de sang, les icônes, le style d'affichage des campagnes, le style d'affichage des besoins par groupe sanguin.

Les prompts visuels (screenshots collés dans Cursor) ont plus pesé que les descriptions textuelles. Quand le résultat était trop vide ou trop aéré :

> Revois le design, tu vois que c'est assez vide ?  
> l'espace est trop.  
> Garder le hero comme s'était

**Arbitrage :** plusieurs tentatives de « redesign global » ont été refusées ; le hero a été figé, le reste itéré section par section.

### 3. Centres — fonctionnalité centrale

> Je veux intégrer un map pour pouvoir afficher selon la position des centres de dons ou campagne  
> Sur la carte, pouvoir avoir l'itinéraire pour aller sur le site  
> Laisser les filtres (recherche, villes, types, RDV) en sticky. Pouvoir paginer.  
> Pour les centres et campagnes, faire du 3*2 et un modal pour afficher les détails  
> Les campagnes aussi : pouvoir récupérer les campagnes proches donc le filtre est appliqué à elles aussi

Données : 8 centres, 8 villes du Bénin, jeu **statique** (pas l’API EFS). Les liens API France ont été laissés en commentaire pour une extension éventuelle, pas branchés.

### 4. Éligibilité et « qui peut donner »

> Déjà si le critère de l'âge dans le simulateur n'est pas respecté, donner le résultat et lui dire en même temps qu'il n'est pas éligible.  
> Mettre la section 'Qui peut donner et qui ne peut pas donner' en toggle un peu comme "Centres permanents & Campagnes"  
> C'est trop long avant d'arriver au simulateur. trouve un moyen d'afficher toutes ses informations mais différemment  
> Pouvoir exporter qui peut donner ou pas en jpeg

Un diaporama typewriter a été demandé, itéré plusieurs fois, puis **abandonné** au profit d’une grille statique plus lisible, déplacée vers la FAQ (« Ce qui vous retient peut-être »).

Simulateur — interaction Oui / date / Non :

> Quand on dit oui, ça n'affiche pas la date du dernier don ? […] comme les rideaux d'une fenêtre  
> Laisser la possibilité de rechoisir encore le "non"  
> […] je demande de faire juste un glissé de droite à gauche

### 5. Motion et parcours

> Intègre du framer motion pour qu'il y ait animation  
> Que ça fasse l'animation de "ça compte".  
> Fais aussi l'animation de progression avec les pourcentages  
> Quand je survole, ça rend le truc plein et si c'est pas l'étape 1, faire la liaison […] ET bien animé et quand on quitte dessus, le lien se rétracte

### 6. Mobile et densité

> Sur petit écran, "OÙ DONNER ?" mettre ça en 2*2  
> Sur mobile mettre les états de réserves en 2*4  
> "Conseils pratiques", faire en sorte que ça soit 4 et 2*2 en mobile. Réduire l'espace entre toutes les sections sur mobile  
> Mettre le FAQ et le formulaire d'inquiétude cote à cote sur grand écran.

### 7. Qualité / process

> tu peux t'inspirer de "intelligency360" pour rédiger le "precommit-check"  
> Le site se charge lentement → code-splitting (`React.lazy` sur les sections sous le fold)

## Ajustements manuels (quoi et pourquoi)

| Quoi | Pourquoi |
|---|---|
| Palette et nommage `primary` / `accent` imposés | Éviter un thème générique et un vocabulaire « bordeaux » dans le code |
| Hero figé après une passe de redesign trop agressive | L’IA remplaçait trop facilement la composition d’entrée |
| Fusion C4+C5 (parcours + conseils) | Une seule timeline plutôt que deux sections redondantes |
| Critères « qui peut / ne peut pas » sortis du simulateur, rangés dans la FAQ | Le simulateur était trop long avant l’action (C3) |
| Diaporama typewriter des critères **retiré** | Joli, mais illisible et instable (hauteur de carte, scroll, HMR) |
| Carte Leaflet + données Bénin statiques | Le brief demande un répertoire filtrable, pas une API live |
| 4e conseil « Le jour J » | Grille 2×2 mobile : 3 cartes laissaient un trou |
| `sessionStorage` sur l’écran de chargement | Ne pas rejouer l’intro à chaque F5 |
| Commits faits à la main (annulation d’une série de commits agent) | Garder la maîtrise du message et de l’historique Git |
| Package `vite-react-typescript-starter` + badge Bolt retirés du README | Restes de scaffold, pas le livrable |

## Limites rencontrées

1. **HMR / import d’icône.** Un 4e conseil a d’abord utilisé `IdCard` (lucide) : l’export n’existait pas dans la version du projet. Vite a échoué à recharger `ProcessSection` (`IdCard is not defined`) — d’où 3 cartes visibles alors que le code visait 4. Corrigé avec une icône déjà importée (`ClipboardCheck`).
2. **L’IA sur-interprète le redesign.** Un prompt « revois le design » a failli casser le hero ; il a fallu figer explicitement ce bloc.
3. **Animations trop ambitieuses.** Le diaporama des critères a demandé ~10 allers-retours (taille de carte, badges, scroll) avant d’être abandonné. Le glissement Oui/date/Non a d’abord « passé en bas » au lieu de glisser horizontalement.
4. **Lazy loading vs écran de chargement.** `React.lazy` a plusieurs fois fait disparaître le loading (Suspense / timing) : il a fallu le rattacher à une logique de session, pas seulement au premier paint.
5. **Accessibilité des dynamiques.** Focus, `aria-expanded`, `role="dialog"` étaient là ; `aria-live` sur erreur / résultat d’éligibilité et formulaire FAQ a été ajouté tard, après relecture du brief — trou classique quand on itère visuellement.
6. **Scaffold Bolt.** Nom de package, badge « Open in Bolt », meta OG Bolt : oubliés jusqu’à la relecture des livrables.

## Ce que l’IA n’a pas décidé

- Le public (primo-donneurs, ton rassurant).
- La palette exacte.
- L’ancrage Bénin (villes, centres fictifs mais crédibles).
- Le refus d’un backend et d’une API EFS en production challenge.
- Les fusions de sections et le déplacement des critères vers la FAQ.
- Les captures de référence collées dans le chat.

L’IA a accéléré l’implémentation. Les arbitrages (quoi montrer, quoi retirer, quand arrêter une animation) sont restés humains.
