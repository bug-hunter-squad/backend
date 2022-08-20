const { Pool, Client } = require('pg');

let connection;

if (process.env.DEPLOYMENT === 'true') {
  connection = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
} else {
  connection = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432
  });
}

connection.connect((error) => {
  if (error) throw error;
  console.log("You're connected to the database");
});

module.exports = connection;
