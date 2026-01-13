# Ontologie de Thèse - Elsa Novelli

Application Next.js pour visualiser et explorer l'ontologie de thèse d'Elsa Novelli avec une interface interactive inspirée de Wikipedia.

## Fonctionnalités

- **Visualisation graphique interactive** : Représentation visuelle des concepts sous forme de graphe interactif
- **Menu latéral** : Liste complète des concepts avec navigation facile
- **Affichage détaillé** : Définitions, auteurs et citations pour chaque concept
- **Données en temps réel** : Connexion directe avec Google Sheets pour des mises à jour dynamiques

## Structure de l'application

- **En-tête** : Titre de la thèse
- **Panneau gauche** : Visualisation graphique interactive de l'ontologie
- **Panneau droit** : Liste des concepts cliquables
- **Panneau bas** : Affichage détaillé du concept sélectionné

## Données

Les données sont hébergées sur Google Sheets et incluent :
- **Colonne B** : Label (nom du concept)
- **Colonne D** : Définition du concept
- **Colonne E** : Auteur 1
- **Colonne G** : Citation de l'auteur 1
- **Colonne H** : Auteur 2
- **Colonne J** : Citation de l'auteur 2

## Installation

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Technologies utilisées

- **Next.js 16** avec App Router
- **TypeScript** pour la sécurité des types
- **Tailwind CSS** pour le styling
- **react-force-graph-2d** pour la visualisation graphique
- **Google Sheets API** pour les données

## Configuration

La clé API Google Sheets et l'ID du spreadsheet sont configurés dans [lib/googleSheets.ts](lib/googleSheets.ts).

## Développement

```bash
# Lancer en mode développement
npm run dev

# Créer une version de production
npm run build

# Démarrer la version de production
npm start
```

## Déploiement

L'application peut être déployée sur Vercel, Netlify, ou tout autre service supportant Next.js.

Pour Vercel :
```bash
npm install -g vercel
vercel
```
