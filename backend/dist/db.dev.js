"use strict";

var _require = require("pg"),
    Pool = _require.Pool; //Just change these variables to your own database name and password


var DB_NAME = 'test4';
var PASSWORD = "postgres";
var PORT = 5433;
var pool = new Pool({
  user: 'postgres',
  host: "localhost",
  database: DB_NAME,
  password: PASSWORD,
  port: PORT
});
module.exports = pool;