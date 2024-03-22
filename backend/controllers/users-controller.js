// USE FOR USER AUTHENTICATION

const jwt = require("jsonwebtoken");

// Function to get all user
const getAllUser = async (req, res, next) => {};

const getUserByID = async (req, res, next) => {};

const registerCourse = async (req, res, next) => {};

//Add a new user
const registerUser = async (req, res, next) => {
  try {
    // Extract user details from request body
    const { username, password, email, name, date_of_birth, role } = req.body;

    // Validate user input
    if (typeof username !== "string" || !username.trim()) {
      return res.status(400).json({ error: "Invalid username" });
    }
    if (typeof password !== "string" || !password.trim()) {
      return res.status(400).json({ error: "Invalid password" });
    }
    if (typeof email !== "string" || !email.trim()) {
      return res.status(400).json({ error: "Invalid email" });
    }
    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ error: "Invalid name" });
    }
    if (new Date(date_of_birth).toString() === "Invalid Date") {
      return res.status(400).json({ error: "Invalid date of birth" });
    }
    if (typeof role !== "string" || !role.trim()) {
      return res.status(400).json({ error: "Invalid role" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 rounds of salting

    // Insert new user into database
    const insertQuery = `
        INSERT INTO Users (username, password, email, name, date_of_birth, role)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, username, email, name, date_of_birth, role;
      `;
    const values = [username, hashedPassword, email, name, date_of_birth, role];
    const { rows } = await pool.query(insertQuery, values);

    // Send success response
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Could not create new user in the database" });
  }
};

const addMember = async (req, res, next) => {
  try {
    // Destructure member information from request body
    const { user_id, weight, height, muscle_mass, body_fat } = req.body;

    // Basic validation
    if (typeof user_id !== "number" || user_id <= 0) {
      return res.status(400).json({ error: "Invalid user ID" });
    }
    if (typeof weight !== "number" || weight <= 0) {
      return res.status(400).json({ error: "Invalid weight" });
    }
    if (typeof height !== "number" || height <= 0) {
      return res.status(400).json({ error: "Invalid height" });
    }
    if (typeof muscle_mass !== "number" || muscle_mass <= 0) {
      return res.status(400).json({ error: "Invalid muscle mass" });
    }
    if (typeof body_fat !== "number" || body_fat <= 0) {
      return res.status(400).json({ error: "Invalid body fat percentage" });
    }

    // Further validation: check if user_id exists in Users table
    const userCheck = await pool.query("SELECT id FROM Users WHERE id = $1", [
      user_id,
    ]);
    if (userCheck.rows.length === 0) {
      return res.status(400).json({ error: "User ID does not exist" });
    }

    // Insert member information into the database, using parameterized query for security
    const { rows } = await pool.query(
      "INSERT INTO Members (user_id, weight, height, muscle_mass, body_fat) VALUES ($1, $2, $3, $4, $5) RETURNING *;",
      [user_id, weight, height, muscle_mass, body_fat]
    );

    // Respond with the newly created member entry
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Could not add member to the database" });
  }
};
