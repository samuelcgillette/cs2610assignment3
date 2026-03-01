import { getClient } from './utils/db.js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

async function createMigrationsTable() {
    const client = getClient();
    
    await client.connect();
    await client.query(`
        CREATE TABLE IF NOT EXISTS migrations (
            filename VARCHAR(255) PRIMARY KEY,
            created_at TIMESTAMP DEFAULT NOW()
        );
    `);
    await client.end();
}

async function runMigrations() {
    const client = getClient();
    const migrations = fs.readdirSync('./migrations').sort();

    await client.connect();
    const { rows } = await client.query('SELECT filename FROM migrations');
    const appliedMigrations = rows.map(row => row.filename);

    for (let migrationFile of migrations) {
        if (!appliedMigrations.includes(migrationFile)) {
            const fileContent = fs.readFileSync(`./migrations/${migrationFile}`, 'utf-8');
            await client.query(fileContent);
            await client.query('INSERT INTO migrations (filename) VALUES ($1)', [migrationFile]);
            console.log(`Applied migration: ${migrationFile}`);
        }
        else {
            console.log(`Skipping already applied migration: ${migrationFile}`);
        }
    }

    await client.end();
}

async function main() {
    await createMigrationsTable();
    await runMigrations();
}   

main();