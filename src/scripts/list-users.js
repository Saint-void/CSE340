import fs from 'fs/promises';
import path from 'path';

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
    } catch (err) {
        // ignore
    }
};

const run = async () => {
    await loadDotEnv();
    const { default: db } = await import('../models/db.js');
    try {
        const res = await db.query('SELECT user_id, name, email, role_id FROM users ORDER BY user_id DESC LIMIT 10');
        console.log('Users:', res.rows);
    } catch (err) {
        console.error('Error querying users:', err.message || err);
    } finally {
        process.exit(0);
    }
};

run();
