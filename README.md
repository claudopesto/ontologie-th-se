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
# 1. Installer les dépendances
npm install

# 2. Configurer les variables d'environnement
# Copiez le fichier .env.example en .env.local
cp .env.example .env.local

# 3. Éditez .env.local et ajoutez vos clés Google Sheets
# NEXT_PUBLIC_GOOGLE_SHEETS_SPREADSHEET_ID=votre_id_spreadsheet
# NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY=votre_clé_api

# 4. Lancer le serveur de développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.

### Configuration rapide pour développement local

Si vous souhaitez tester rapidement l'application en local avec les données de test :

1. Créez un fichier `.env.local` à la racine du projet :
```bash
NEXT_PUBLIC_GOOGLE_SHEETS_SPREADSHEET_ID=1N-6a1jDlqqxrn_jNYVw-f98BsgqcCCPnCOCnwNUxEGw
NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY=AIzaSyBaYOTs8pGLtN_UPAqR2cmAuh139krUx3o
```

2. Installez les dépendances et lancez le serveur :
```bash
npm install
npm run dev
```

3. Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur

> **Note**: Ces clés sont pour le développement et les tests uniquement. Utilisez vos propres clés pour la production.

## Technologies utilisées

- **Next.js 16** avec App Router
- **TypeScript** pour la sécurité des types
- **Tailwind CSS** pour le styling
- **react-force-graph-2d** pour la visualisation graphique
- **Google Sheets API** pour les données

## Configuration

### Variables d'environnement

Les variables d'environnement nécessaires sont définies dans le fichier `.env.local` :

- `NEXT_PUBLIC_GOOGLE_SHEETS_SPREADSHEET_ID` : L'ID de votre Google Spreadsheet
- `NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY` : Votre clé API Google Sheets

Un fichier `.env.example` est fourni comme modèle.

## Développement

```bash
# Lancer en mode développement
npm run dev

# Créer une version de production
npm run build

# Démarrer la version de production
npm start
```

## Résolution de problèmes

### Le graphique ne s'affiche pas en local

Si vous ne voyez pas le graphique après avoir lancé `npm run dev` :

1. **Vérifiez que le fichier `.env.local` existe** à la racine du projet
2. **Vérifiez les variables d'environnement** dans `.env.local` :
   ```
   NEXT_PUBLIC_GOOGLE_SHEETS_SPREADSHEET_ID=1N-6a1jDlqqxrn_jNYVw-f98BsgqcCCPnCOCnwNUxEGw
   NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY=AIzaSyBaYOTs8pGLtN_UPAqR2cmAuh139krUx3o
   ```
3. **Redémarrez le serveur** après avoir créé/modifié `.env.local` :
   - Arrêtez le serveur (Ctrl+C)
   - Relancez avec `npm run dev`
4. **Vérifiez la console du navigateur** (F12) pour voir s'il y a des erreurs
5. **Attendez quelques secondes** - le graphique peut prendre un moment pour charger les données depuis Google Sheets

### Erreur "Failed to fetch" ou "ERR_BLOCKED_BY_CLIENT"

Si vous voyez ces erreurs dans la console :
- Désactivez temporairement les bloqueurs de publicité ou extensions de confidentialité
- Vérifiez que vous pouvez accéder à `sheets.googleapis.com`

## Déploiement

### Déploiement sur Vercel avec GitHub

1. **Pousser votre code sur GitHub** :
```bash
git add .
git commit -m "Update: Configure environment variables"
git remote add origin https://github.com/VOTRE-USERNAME/ontologie-these.git
git push -u origin main
```

2. **Connecter à Vercel** :
   - Allez sur [vercel.com](https://vercel.com)
   - Connectez-vous avec GitHub
   - Cliquez sur "Add New Project"
   - Importez votre dépôt GitHub

3. **Configurer les variables d'environnement sur Vercel** :
   - Dans les paramètres du projet sur Vercel
   - Allez dans "Settings" > "Environment Variables"
   - Ajoutez les variables suivantes :
     - `NEXT_PUBLIC_GOOGLE_SHEETS_SPREADSHEET_ID`
     - `NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY`

4. **Déployer** :
   - Cliquez sur "Deploy"
   - Vercel construira et déploiera automatiquement votre application

### Déploiement local avec Vercel CLI

```bash
npm install -g vercel
vercel
```
