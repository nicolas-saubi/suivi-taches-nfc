import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

// Charge les variables depuis .env.development.local pour le CLI
dotenv.config({ path: '.env.development.local' });

export default defineConfig({
  schema: './src/db/schema.ts', // Chemin vers ton fichier de schéma
  out: './src/db/migrations',   // Dossier où seront générées tes migrations
  dialect: 'postgresql',        // On utilise Postgres (Neon)
  dbCredentials: {
    url: process.env.DATABASE_URL!, // Utilise la variable définie dans ton .env
  },
});