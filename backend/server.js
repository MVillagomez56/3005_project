const express = require("express");
const pool = require("./db"); // Assuming you have db.js set up for PostgreSQL
const cors = require("cors");
const path = require("path");

const app = express();
const port = 5000;

  
// Import routes
const userRouter = require("./routes/userRouter");
const classRouter = require("./routes/classRoute");
const paymentRouter = require("./routes/paymentRoute");
const trainerRouter = require("./routes/trainerRoute");
const equipmentRouter = require("./routes/equipmentRoute");

// Use the routes
app.use(cors());
app.use(express.json());
app.use("/api", userRouter);
app.use("/api/classes", classRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/trainers", trainerRouter);
app.use("/api/equipment", equipmentRouter);

// Check database connection 
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
  
// Connect to database
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });