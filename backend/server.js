const express = require("express");
const pool = require("./db"); // Assuming you have db.js set up for PostgreSQL
const cors = require("cors");
const path = require("path");

const app = express();
const port = 5000;

  
// Import routes
const userRouter = require("./routes/userRouter");
// const classRouter = require("./routes/classRoute");

// Use the routes
app.use(cors());
app.use(express.json());
app.use("/users", userRouter);
// app.use("/classes", classRouter);

// Check database connection 
console.log("Testing database connection...");

try {
  pool.query("SELECT NOW()", (err, res) => {
    if (err) {
      console.error("Error testing the database connection", err.stack);
    } else {
      console.log(
        "Database connection is successful. Current time from DB:",
        res.rows[0]["now"]
      );
    }
  });
} catch (error) {
  console.error("Unexpected error when testing database connection:", error);
}

console.log("Database connection test query sent, awaiting response...");

  
// Connect to database
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });