import fs from 'fs/promises';
import path from 'path';

/**
 * Load .env file into process.env if present (simple parser)
 */
const loadDotEnv = async () => {
    const envPath = path.resolve(process.cwd(), '.env');
    try {
        const envData = await fs.readFile(envPath, 'utf8');
        envData.split(/\r?\n/).forEach(line => {
            const m = line.match(/^\s*([^#][^=]*)=(.*)$/);
            if (m) {
                const key = m[1].trim();
                let val = m[2].trim();
                if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
                    val = val.slice(1, -1);
                }
                process.env[key] = val;
            }
        });
        console.log('Loaded .env from', envPath);
    } catch (err) {
        // ignore if no .env
    }
};

const run = async () => {
    try {
        // Load environment variables from .env so db connection can use DB_URL
        await loadDotEnv();

        // Import the DB module after env is loaded
        const { default: db } = await import('../models/db.js');

        const sqlPath = path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'setup.sql');
        const sql = await fs.readFile(sqlPath, 'utf8');

        // Split statements on semicolon and execute sequentially
        const statements = sql
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        for (const stmt of statements) {
            try {
                const res = await db.query(stmt);
                console.log('Executed statement:', stmt.substring(0, 80).replace(/\s+/g, ' ').trim(), '...');
            } catch (err) {
                console.error('Statement failed:', stmt.substring(0, 80).replace(/\s+/g, ' ').trim(), '...');
                console.error(err.stack || err.message || err);
                // continue executing remaining statements
            }
        }

        console.log('Database initialization script completed.');
        process.exit(0);
    } catch (error) {
        console.error('Failed to run init-db:', error);
        process.exit(1);
    }
};

run();
