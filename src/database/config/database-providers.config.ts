// src/database/config/database-providers.config.ts
export const databaseProviders = {
  mongodb: {
    host: process.env.MONGODB_HOST || 'cluster0.gjtxiqw.mongodb.net',
    user: process.env.MONGODB_USER || 'babaissandiaye242',
    password: process.env.MONGODB_PASSWORD || 'GT68bbIMfz8zOm8g',
    database: process.env.MONGODB_DATABASE || 'test',
  },
  postgres: {
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
  },
  // ajout d'autres base de données si necessaires
};
