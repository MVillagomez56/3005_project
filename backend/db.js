const { Pool } = require("pg");
//Just change these variables to your own database name and password
const DB_NAME = 'GroupProject'
const PASSWORD = "zh2131"
const PORT = 5432

const pool = new Pool({
  user: 'postgres',
  host: "localhost",
  database: DB_NAME,
  password: PASSWORD,
  port: PORT
});

module.exports = pool;