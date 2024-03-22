const { Pool } = require("pg");

// Please make sure that you set up exact the same cresidential as this one!!
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "COMP3005GroupProject", // change to your own postgres database name!!
  password: "password", // change to your own postgres password!!
  port: 5432,
});

module.exports = pool;