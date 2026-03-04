import pool from './utils/db.js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

async function createMigrationsTable() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS migrations (
            filename VARCHAR(255) PRIMARY KEY,
            created_at TIMESTAMP DEFAULT NOW()
        );
    `);
}

async function runMigrations() {
    const migrations = fs.readdirSync('./migrations').sort();

    const { rows } = await pool.query('SELECT filename FROM migrations');
    const appliedMigrations = rows.map(row => row.filename);

    for (let migrationFile of migrations) {
        if (!appliedMigrations.includes(migrationFile)) {
            const fileContent = fs.readFileSync(`./migrations/${migrationFile}`, 'utf-8');
            await pool.query(fileContent);
            await pool.query('INSERT INTO migrations (filename) VALUES ($1)', [migrationFile]);
            console.log(`Applied migration: ${migrationFile}`);
        }
        else {
            console.log(`Skipping already applied migration: ${migrationFile}`);
        }
    }

}

async function main() {
    await createMigrationsTable();
    await runMigrations();
}   

main();