# CoopLedger — Interface Web Next.js

Interface web frontend pour CoopLedger — gouvernance financière transparente pour les coopératives agricoles togolaises, sécurisée par la blockchain Polygon.

**Équipe Hunter Chain (TG-35) · MIABE Hackathon 2026 · Projet T-02**

---

## Stack technique

- **Next.js 14** avec App Router + TypeScript
- **Recharts** — graphiques interactifs (courbes, barres, camembert)
- **React Icons + Lucide React** — icônes professionnelles
- **Axios + js-cookie** — appels API et gestion des tokens JWT
- **Tailwind CSS** — classes utilitaires
- **Sora + DM Serif Display + IBM Plex Mono** — typographie soignée

---

## Pages implémentées

| Page | Route | Description |
|------|-------|-------------|
| **Tableau public** | `/` | Dashboard public lecture seule — solde, transactions, votes |
| **Connexion** | `/login` | Auth OTP SMS · saisie numéro → code 6 chiffres |
| **Dashboard** | `/dashboard` | Vue d'ensemble · stats · graphiques · transactions récentes |
| **Transactions** | `/dashboard/transactions` | Historique complet · CRUD · export CSV · preuves Polygon |
| **Votes** | `/dashboard/votes` | Résolutions · vote POUR/CONTRE · résultats on-chain |
| **Membres** | `/dashboard/members` | Gestion CRUD · graphique engagement · wallets |
| **Rapports** | `/dashboard/reports` | Rapports mensuels PDF certifiés Polygon |
| **Paramètres** | `/dashboard/settings` | En cours de développement |

---

## Thèmes

Deux thèmes basculables en un clic depuis la sidebar :

- **Saison sèche** (défaut) — fond noir · orange sombre `#f07a2a` · ambiance harmattan
- **Saison des pluies** — fond blanc · vert émeraude `#059669` · ambiance verdoyante

---

## Installation

```bash
# 1. Cloner et entrer dans le dossier
cd coopledger-web

# 2. Copier le fichier d'environnement
cp .env.local.example .env.local
# Modifier NEXT_PUBLIC_API_URL selon votre backend Django

# 3. Installer les dépendances
npm install

# 4. Lancer en développement
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000).

---

## Structure des fichiers

```
coopledger-web/
├── app/                        # App Router Next.js
│   ├── layout.tsx              # Root layout (ThemeProvider + AuthProvider)
│   ├── globals.css             # CSS global + variables thèmes
│   ├── page.tsx                # Page publique (/)
│   ├── login/page.tsx          # Connexion
│   └── dashboard/
│       ├── layout.tsx          # Guard auth + layout sidebar
│       ├── page.tsx            # Overview
│       ├── transactions/
│       ├── votes/
│       ├── members/
│       ├── reports/
│       └── settings/
├── components/
│   ├── ui/index.tsx            # Button, Badge, Modal, Toast, Avatar, etc.
│   ├── auth/LoginPage.tsx      # Page connexion OTP
│   ├── dashboard/
│   │   ├── Layout.tsx          # Sidebar navigation
│   │   ├── Overview.tsx        # Dashboard principal
│   │   ├── PublicDashboard.tsx # Vue publique
│   │   └── ReportsPage.tsx
│   ├── transactions/
│   ├── votes/
│   └── members/
├── hooks/
│   ├── useAuth.tsx             # Context auth + JWT
│   └── useTheme.tsx            # Context thème dry/rain
├── lib/
│   ├── api.ts                  # Axios client + endpoints
│   └── utils.ts                # Formatters + helpers
└── types/index.ts              # TypeScript types (modèles Django)
```

---

## Intégration avec le backend Django

L'API est configurée via `NEXT_PUBLIC_API_URL`. Tous les endpoints correspondent aux URLs Django :

```
POST /api/auth/request-otp/     → Demande OTP SMS
POST /api/auth/verify-otp/      → Vérification + tokens JWT
GET  /api/auth/me/              → Utilisateur connecté
GET  /api/transactions/         → Liste transactions
POST /api/transactions/         → Créer transaction
GET  /api/transactions/summary/ → Statistiques
GET  /api/votes/                → Liste votes
POST /api/votes/                → Créer vote
POST /api/votes/:id/cast/       → Voter
GET  /api/cooperatives/members/ → Liste membres
```

Les tokens JWT sont stockés dans les cookies et localStorage. Le refresh automatique est géré par l'intercepteur Axios.

---

## Données de démonstration

En l'absence de backend, toutes les pages utilisent des données simulées réalistes (Coopérative Agricole de Kpalimé — 12 membres, 34 transactions, 3 votes) conformément à la stratégie de démonstration du cahier des charges.

---

## Rôles et permissions

| Fonctionnalité | Président | Trésorier | Membre | Auditeur | Ministère |
|---|---|---|---|---|---|
| Dashboard | Web | Web | Mobile | Web (lecture) | Web (lecture) |
| Transactions | CRUD | CRUD | Non | Lecture | Lecture |
| Votes | Créer/Clôturer | Créer/Clôturer | Voter | Lecture | Lecture |
| Membres | CRUD | Non | Non | Non | Non |
| Rapports | Générer | Générer | Lecture | Lecture | Lecture |
