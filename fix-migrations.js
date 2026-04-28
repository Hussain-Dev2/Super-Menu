const { Client } = require('pg');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const connectionString = process.env.DIRECT_URL;

if (!connectionString) {
  console.error('❌ DIRECT_URL not found in .env file.');
  process.exit(1);
}

async function fixMigrations() {
  const client = new Client({
    connectionString: connectionString,
    ssl: {
      rejectUnauthorized: false // Required for Supabase
    }
  });

  try {
    console.log('🚀 Connecting to Supabase database...');
    await client.connect();
    console.log('✅ Connected.');

    console.log('🛠️ Creating schema "supabase_migrations"...');
    await client.query('CREATE SCHEMA IF NOT EXISTS supabase_migrations;');

    console.log('🛠️ Creating table "supabase_migrations.schema_migrations"...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS supabase_migrations.schema_migrations (
        version text NOT NULL PRIMARY KEY,
        statements text[],
        name text
      );
    `);

    console.log('🎉 Successfully created migration tracking table!');
    console.log('You can now use Supabase CLI migrations or the Dashboard Migration UI.');

  } catch (err) {
    console.error('❌ Error executing SQL:', err.message);
  } finally {
    await client.end();
  }
}

fixMigrations();
