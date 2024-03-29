"use strict";

var _require = require("pg"),
    Pool = _require.Pool;

var DB_NAME = 'GroupProject'; // Please make sure that you set up exact the same cresidential as this one!!

var pool = new Pool({
  user: 'postgres',
  host: "localhost",
  database: "GroupProject",
  password: 'zh2131',
  port: 5432
});
module.exports = pool;