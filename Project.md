# API Bibliothèque en Ligne

Une API REST complète pour la gestion d'une bibliothèque en ligne, développée avec NestJS et MongoDB.

## 🚀 Fonctionnalités

### Gestion des Livres
- Opérations CRUD complètes sur les livres
- Système de notation et commentaires
- Recherche avancée avec filtres et pagination
- Classement des livres les mieux notés

### Authentification
- Système complet d'inscription et connexion
- Protection des routes avec JWT
- Gestion sécurisée des mots de passe

### Système de Reviews
- Notation de 1 à 5 étoiles
- Commentaires détaillés
- Calcul automatique des moyennes
- Protection contre les votes multiples

## 📋 Modèles de Données

### Livre (Book)
```typescript
{
  title: string;          // Obligatoire
  author: string;         // Obligatoire
  publishedDate: Date;    // Optionnel
  category: string;       // Optionnel
  rating: number;         // Calculé automatiquement
  reviews: Review[];      // Liste des commentaires
}
```

### Commentaire (Review)
```typescript
{
  rating: number;         // Entre 1 et 5
  comment: string;        // Minimum 10 caractères
  userId: string;         // ID de l'utilisateur
  createdAt: Date;       // Date automatique
}
```

### Utilisateur (User)
```typescript
{
  email: string;         // Unique, obligatoire
  password: string;      // Hashé, min 6 caractères
  name: string;         // Optionnel
}
```

## 🛣 Routes API

### Authentification
```
POST /auth/register - Inscription
POST /auth/login    - Connexion
```

### Livres
```
GET    /books          - Liste tous les livres
POST   /books          - Crée un nouveau livre
GET    /books/:id      - Détails d'un livre
PATCH  /books/:id      - Modifie un livre
DELETE /books/:id      - Supprime un livre
GET    /books/top-rated - Livres les mieux notés
POST   /books/:id/review - Ajoute une review
```

### Recherche
```
GET /books?searchTerm=&searchField=&sortOrder=&sortBy=&page=&limit=
```

Paramètres de recherche :
- `searchTerm`: Terme de recherche
- `searchField`: title | author | category
- `sortOrder`: asc | desc
- `sortBy`: publishedDate | rating
- `page`: Numéro de page
- `limit`: Éléments par page (max 50)

## 🔒 Sécurité

- Toutes les routes (sauf /auth/*) nécessitent un JWT valide
- Protection contre les injections NoSQL
- Validation des données entrantes
- Hachage des mots de passe avec bcrypt

## 🚨 Gestion des Erreurs

L'API retourne des erreurs structurées :
- 400: Données invalides
- 401: Non authentifié
- 403: Non autorisé
- 404: Ressource non trouvée
- 409: Conflit (ex: email déjà utilisé)
- 500: Erreur serveur

## 📚 Documentation

La documentation complète de l'API est disponible via Swagger :
```
http://localhost:3000/api
```

## ⚡ Installation et Démarrage

1. Cloner le repository
```bash
git clone [url-du-repo]
```

2. Installer les dépendances
```bash
npm install
```

3. Configurer les variables d'environnement
```bash
cp .env.example .env
```

4. Démarrer l'application
```bash
npm run start:dev
```

## 🧪 Tests

Exécuter les tests unitaires :
```bash
npm run test
```

## 📝 Notes de Développement

- Utilisation de class-validator pour la validation des DTO
- Indexation MongoDB pour optimiser les recherches
- Middleware de calcul automatique des moyennes
- Gestion des erreurs centralisée

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.
