# 🏥 Clinique Gamma - Plateforme Médicale Intelligente

Bienvenue sur le dépôt de **Clinique Gamma**, une solution complète de gestion hospitalière intégrant un frontend futuriste et un backend robuste.

---

## 🔷 1. Architecture du Projet

Le projet est divisé en deux parties :

*   **Frontend (Racine)** : Application React + Vite + Tailwind CSS. Interface utilisateur moderne (Glassmorphism, Neon UI).
*   **Backend (Dossier `/backend`)** : API Node.js + Express + MongoDB. Gestion des données, authentification et logique métier.

---

## 🔷 2. Identifiants Admin par défaut

Une fois le backend déployé et la base de données initialisée (seed), voici les accès administrateur :

*   **URL Connexion** : `/auth` (ou via le bouton "Espace Pro")
*   **Email** : `admin@clinic.com`
*   **Mot de passe** : `admin123`

> ⚠️ **Important** : Il est impératif de changer ces identifiants après la première connexion dans la section "Paramètres" ou directement en base de données.

---

## 🔷 3. Guide de Déploiement

### 🔸 A. Déploiement du Backend (Render)

1.  Créez un compte sur [Render](https://render.com).
2.  Cliquez sur **"New"** > **"Web Service"**.
3.  Connectez votre dépôt GitHub.
4.  Configurez le service :
    *   **Root Directory** : `backend`
    *   **Build Command** : `npm install`
    *   **Start Command** : `node server.js`
5.  Ajoutez les **Variables d'Environnement** (Environment Variables) :
    *   `MONGODB_URI` : Votre chaîne de connexion MongoDB Atlas (ex: `mongodb+srv://...`)
    *   `JWT_SECRET` : Une chaîne aléatoire complexe pour sécuriser les tokens.
    *   `PORT` : `3000` (ou laissez Render gérer).
6.  Lancez le déploiement.

### 🔸 B. Déploiement du Frontend (Vercel)

1.  Créez un compte sur [Vercel](https://vercel.com).
2.  Importez le projet depuis GitHub.
3.  Configurez le projet :
    *   **Framework Preset** : Vite
    *   **Root Directory** : `./` (Racine)
4.  Ajoutez les **Variables d'Environnement** :
    *   `VITE_API_URL` : L'URL de votre backend déployé sur Render (ex: `https://clinique-gamma-api.onrender.com`).
5.  Cliquez sur **Deploy**.

---

## 🔷 4. Installation Locale (Développement)

### Prérequis
*   Node.js v18+
*   MongoDB (Local ou Atlas)

### Installation Backend
```bash
cd backend
npm install
# Créez un fichier .env avec MONGODB_URI et JWT_SECRET
node server.js
```

### Installation Frontend
```bash
# À la racine du projet
npm install
npm run dev
```

---

## 🔷 5. Stack Technique

### Frontend
*   **Framework** : React 18
*   **Build Tool** : Vite
*   **Styling** : Tailwind CSS (Mode Sombre/Clair dynamique)
*   **Icônes** : Lucide React
*   **IA** : Intégration Google Gemini API (Simulée côté client pour la démo)

### Backend
*   **Runtime** : Node.js
*   **Framework** : Express.js
*   **Database** : MongoDB (Mongoose ODM)
*   **Sécurité** : JWT (JSON Web Tokens), bcryptjs (Hashage mots de passe), cors.

---

## 🔷 6. Fonctionnalités Clés

*   **Mode Sombre/Clair** : Basculez le thème via la barre latérale.
*   **Tableaux de Bord par Rôle** : Admin, Médecin, Pharmacien, Patient.
*   **Pharmacie** : Gestion de stock, prédictions de rupture par IA.
*   **Dossier Médical** : Historique, constantes, ordonnances.
*   **Urgences** : Système d'alerte sonore et visuelle en temps réel.
