const { Pool } = require("pg");
const DB_NAME = 'GroupProject'

// Please make sure that you set up exact the same cresidential as this one!!
const pool = new Pool({
  user: 'postgres',
  host: "localhost",
  database: "test4",
  password: 'postgres',
  port: 5433,
});

module.exports = pool;