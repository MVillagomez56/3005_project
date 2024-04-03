const { Pool } = require("pg");
//Just change these variables to your own database name and password
const DB_NAME = 'test4'
const PASSWORD = "postgres"
const PORT = 5433

const pool = new Pool({
  user: 'postgres',
  host: "localhost",
  database: DB_NAME,
  password: PASSWORD,
  port: PORT
});

module.exports = pool;