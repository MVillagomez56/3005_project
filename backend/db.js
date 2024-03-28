const { Pool } = require("pg");
<<<<<<< HEAD
const DB_NAME = 'GroupProject'
=======
const DB_NAME = 'test4'
>>>>>>> 7d8605674b909fc582c7265d06ac77dc1647624b

// Please make sure that you set up exact the same cresidential as this one!!
const pool = new Pool({
  user: 'postgres',
  host: "localhost",
<<<<<<< HEAD
  database: "GroupProject",
  password: 'zh2131',
  port: 5432,
=======
  database: DB_NAME,
  password: 'postgres',
  port: 5433,
>>>>>>> 7d8605674b909fc582c7265d06ac77dc1647624b
});

module.exports = pool;