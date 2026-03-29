# 🔗 Connecteur MCP Dendreo pour Claude

Ce serveur MCP permet à Claude de se connecter directement à votre compte Dendreo pour consulter et gérer vos données de formation.

## 📋 Outils disponibles

| Outil | Description |
|-------|-------------|
| `lister_actions_de_formation` | Liste les ADF (filtrable par statut, date) |
| `afficher_action_de_formation` | Détail d'une ADF par son ID |
| `creer_action_de_formation` | Crée une nouvelle ADF |
| `lister_participants` | Liste les stagiaires |
| `afficher_participant` | Détail d'un stagiaire (par ID ou email) |
| `creer_participant` | Crée un nouveau stagiaire |
| `inscriptions_participant` | Formations d'un stagiaire |
| `lister_entreprises` | Liste les entreprises clientes |
| `afficher_entreprise` | Détail d'une entreprise |
| `creer_entreprise` | Crée une nouvelle entreprise |
| `lister_contacts_entreprise` | Contacts d'une entreprise |
| `lister_formateurs` | Liste les formateurs |
| `afficher_formateur` | Détail d'un formateur |
| `creer_formateur` | Crée un nouveau formateur |
| `interventions_formateur` | ADF d'un formateur |
| `lister_modules` | Catalogue de modules |
| `afficher_module` | Détail d'un module |
| `lister_categories_modules` | Catégories du catalogue |
| `prochaines_sessions` | Prochaines sessions publiques |

---

## 🚀 Déploiement sur Railway (recommandé)

### Étape 1 — Prérequis
- Un compte [Railway](https://railway.app) (gratuit pour démarrer)
- Un compte [GitHub](https://github.com) (gratuit)
- Node.js installé sur votre ordinateur ([nodejs.org](https://nodejs.org))

### Étape 2 — Préparer le projet
```bash
# Installer les dépendances
npm install

# Vérifier que le build fonctionne
npm run build
```

### Étape 3 — Mettre sur GitHub
1. Créez un nouveau dépôt sur GitHub (bouton "New repository")
2. Dans votre terminal, dans le dossier du projet :
```bash
git init
git add .
git commit -m "Initial commit — Dendreo MCP Server"
git branch -M main
git remote add origin https://github.com/VOTRE_USERNAME/dendreo-mcp.git
git push -u origin main
```

### Étape 4 — Déployer sur Railway
1. Allez sur [railway.app](https://railway.app) et connectez-vous
2. Cliquez **"New Project"** → **"Deploy from GitHub repo"**
3. Sélectionnez votre dépôt `dendreo-mcp`
4. Railway détecte automatiquement Node.js et lance le build

### Étape 5 — Configurer les variables d'environnement
Dans Railway, allez dans votre projet → onglet **Variables** → ajoutez :

| Nom | Valeur |
|-----|--------|
| `DENDREO_BASE_URL` | `https://pro.dendreo.com/VOTRE_COMPTE/api` |
| `DENDREO_API_KEY` | Votre clé API Dendreo |

> 💡 **Où trouver votre clé API Dendreo ?**
> Dans Dendreo : Configuration → API → Gérer les clés API

### Étape 6 — Récupérer l'URL publique
Dans Railway → onglet **Settings** → **Networking** → cliquez **"Generate Domain"**.
Vous obtenez une URL du type : `https://dendreo-mcp-production.up.railway.app`

### Étape 7 — Ajouter le connecteur dans Claude
1. Ouvrez [claude.ai](https://claude.ai) → **Paramètres** → **Connecteurs**
2. Cliquez **"Ajouter un connecteur personnalisé"**
3. Entrez l'URL : `https://votre-url.up.railway.app/mcp`
4. Cliquez **"Ajouter"**

✅ C'est tout ! Claude peut maintenant accéder à Dendreo.

---

## 🧪 Test en local

```bash
# Créez votre fichier .env à partir du modèle
cp .env.example .env
# Éditez .env avec vos vraies valeurs

# Lancer le serveur en local
npm run dev
```

Puis dans Claude Desktop, ajoutez `http://localhost:3000/mcp` comme connecteur.

---

## 💬 Exemples de questions à poser à Claude

Une fois le connecteur actif, vous pouvez demander à Claude :

- *"Liste mes prochaines actions de formation"*
- *"Cherche le participant Jean Dupont dans Dendreo"*
- *"Quels formateurs sont disponibles ?"*
- *"Montre-moi le catalogue de modules"*
- *"Liste les entreprises clientes"*

---

## 🔐 Sécurité

- Ne commitez **jamais** votre fichier `.env` (il est dans `.gitignore`)
- Dans Dendreo, créez une clé API avec **uniquement les droits nécessaires** (lecture seule si vous ne voulez pas que Claude puisse créer des données)
- Vous pouvez restreindre l'API à des IPs spécifiques dans la config Dendreo

---

## ❓ Besoin d'aide ?

- Documentation API Dendreo : [developers.dendreo.com](https://developers.dendreo.com)
- Documentation MCP : [modelcontextprotocol.io](https://modelcontextprotocol.io)
