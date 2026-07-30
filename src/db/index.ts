import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// On initialise le client HTTP Neon avec la variable d'environnement
const sql = neon(process.env.DATABASE_URL!);

// On exporte l'instance Drizzle configurée avec notre schéma
export const db = drizzle(sql, { schema });