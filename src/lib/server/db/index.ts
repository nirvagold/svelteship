import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '$env/dynamic/private';
import * as schema from './schema';

let _db: PostgresJsDatabase<typeof schema> | null = null;

function getDb(): PostgresJsDatabase<typeof schema> {
	if (_db) return _db;

	if (!env.DATABASE_URL) {
		throw new Error('DATABASE_URL environment variable is not set');
	}

	const client = postgres(env.DATABASE_URL);
	_db = drizzle(client, { schema });
	return _db;
}

export const db = new Proxy({} as PostgresJsDatabase<typeof schema>, {
	get(_, prop) {
		return getDb()[prop as keyof PostgresJsDatabase<typeof schema>];
	}
});
