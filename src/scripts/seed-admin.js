import fs from 'fs/promises';
import path from 'path';
import bcrypt from 'bcrypt';

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
        console.log('Loaded .env');
    } catch (err) {
        console.warn('No .env found, relying on environment variables');
    }
};

const run = async () => {
    await loadDotEnv();
    const { default: db } = await import('../models/db.js');

    const adminEmail = 'admin@example.com';
    const adminPassword = 'cse340!';
    const adminName = 'Admin User';

    try {
        // Ensure roles exist
        await db.query("INSERT INTO roles (role_name, role_description) VALUES ($1, $2) ON CONFLICT (role_name) DO NOTHING", ['admin', 'Administrator']);
        await db.query("INSERT INTO roles (role_name, role_description) VALUES ($1, $2) ON CONFLICT (role_name) DO NOTHING", ['user', 'Regular user']);

        const roleRes = await db.query('SELECT role_id FROM roles WHERE role_name = $1', ['admin']);
        const adminRoleId = roleRes.rows[0].role_id;

        // Check if admin user exists
        const userRes = await db.query('SELECT user_id, role_id FROM users WHERE email = $1', [adminEmail]);
        if (userRes.rows.length === 0) {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(adminPassword, salt);
            const insertRes = await db.query('INSERT INTO users (name, email, password_hash, role_id) VALUES ($1, $2, $3, $4) RETURNING user_id', [adminName, adminEmail, hash, adminRoleId]);
            console.log('Created admin user with id', insertRes.rows[0].user_id);
        } else {
            const existing = userRes.rows[0];
            if (existing.role_id !== adminRoleId) {
                await db.query('UPDATE users SET role_id = $1 WHERE user_id = $2', [adminRoleId, existing.user_id]);
                console.log('Updated existing user to admin role');
            } else {
                console.log('Admin user already exists');
            }
        }

        console.log('Seeding complete');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding admin user:', err);
        process.exit(1);
    }
};

run();
