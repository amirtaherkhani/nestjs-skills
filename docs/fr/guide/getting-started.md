---
title: Premiers pas | NestJS Skills
description: Installer et utiliser NestJS Skills avec Claude Code, Codex et les outils compatibles avec Agent Skills.
---

<p class="doc-kicker">Guide · 5 minutes</p>

# Premiers pas

<p class="doc-lede">Installez sept compétences Agent Skills pour l’ingénierie logicielle, la publication Git, l’architecture NestJS et les audits de code ou de fonctionnalités.</p>

## Prérequis

- Node.js 20 ou version ultérieure pour valider le dépôt et construire le site de documentation.
- Claude Code, Codex ou un autre client compatible avec la [spécification Agent Skills](https://agentskills.io/specification).
- Un dépôt NestJS à examiner : cette collection est conçue pour les projets NestJS.

## Installation

Installez la collection avec l’interface en ligne de commande Skills :

```bash
npx skills add amirtaherkhani/nestjs-skills
```

Pour installer un seul skill dans Claude Code et Codex, indiquez son identifiant ainsi que les deux outils :

```bash
npx skills add amirtaherkhani/nestjs-skills \
  --skill nestjs-professional-software-engineering \
  --agent claude-code \
  --agent codex
```

Pour afficher les skills disponibles sans les installer :

```bash
npx skills add amirtaherkhani/nestjs-skills --list
```

L’option `--global` installe les skills pour votre compte utilisateur. Sans elle, la CLI choisit l’emplacement du projet attendu par chaque agent.

## Choisir une compétence

Chaque skill couvre une partie du travail :

- `nestjs-professional-software-engineering` : implémentation et coordination technique.
- `nestjs-git-commit-pr-message` : publication des changements vérifiés dans Git.
- `nestjs-code-audit` : examen en lecture seule de la qualité et des risques du dépôt.
- `nestjs-feature-audit` : comparaison d’une fonctionnalité à sa feuille de route documentée.
- `nestjs-architecture-principles` : responsabilité des modules et frontières d’architecture.
- `nestjs-oop-design-patterns` : responsabilités des objets, SOLID et modèles de conception.
- `nestjs-features-performance` : cycle des requêtes, erreurs, performances et montée en charge.

Les guides techniques complets, les concepts NestJS et les références de règles sont actuellement en anglais. Consultez le [guide de sélection](../../guide/choose-a-skill) et les [règles](../../rules/) pour trouver le bon parcours.

## Appeler une compétence

Les descriptions sont conçues pour une activation automatique. Une demande précise suffit généralement :

```text
Implement this feature using the clearest syntax supported by the current project, then verify it.
```

Vous pouvez aussi nommer explicitement une compétence :

```text
$nestjs-professional-software-engineering
```

## Langues de la documentation

La page d’accueil et ce guide sont disponibles en français. Les références techniques détaillées restent en anglais. Le menu des langues conserve la page courante lorsqu’une traduction existe ; sinon, il ouvre la page d’accueil dans la langue choisie.

## Licence

Le projet est distribué sous [licence MIT](https://github.com/amirtaherkhani/nestjs-skills/blob/main/LICENSE). Consultez le [dépôt GitHub](https://github.com/amirtaherkhani/nestjs-skills) pour la version et l’historique des changements.
