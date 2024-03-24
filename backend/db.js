const { Pool } = require("pg");
const DB_NAME = 'test4'

// Please make sure that you set up exact the same cresidential as this one!!
const pool = new Pool({
  user: 'postgres',
  host: "localhost",
  database: DB_NAME,
  password: 'postgres',
  port: 5433,
});

module.exports = pool;