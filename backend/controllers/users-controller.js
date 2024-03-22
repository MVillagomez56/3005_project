// USE FOR USER AUTHENTICATION

const jwt = require("jsonwebtoken");

// Function to get all user
const getAllUsers = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, email, name, date_of_birth, role FROM Users ORDER BY id;"
    );
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving users." });
  }
};

const getUserById = async (req, res, next) => {
  const userId = parseInt(req.params.id); 

  // Validate that the provided ID is a number
  if (isNaN(userId)) {
    return res.status(400).json({ error: "Invalid user ID." });
  }

  try {
    const { rows } = await pool.query(
      "SELECT id, email, name, date_of_birth, role FROM Users WHERE id = $1;",
      [userId] 
    );

    // Check if a user was found
    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json(rows[0]); // Send the found user
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving the user." });
  }
};

const registerCourse = async (req, res, next) => {};

// Post
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

// add payment
const addPayment = async (req, res, next) => {
  try {
    // Destructure payment information from request body
    const { member_id, amount, payment_date, service, completion_status } =
      req.body;

    // Basic validation
    if (typeof member_id !== "number" || member_id <= 0) {
      return res.status(400).json({ error: "Invalid member ID" });
    }
    if (typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }
    if (new Date(date).toString() === "Invalid Date") {
      return res.status(400).json({ error: "Invalid date" });
    }
    if (typeof service !== "string" || !service.trim()) {
      return res.status(400).json({ error: "Invalid service" });
    }

    const memberCheck = await pool.query(
      "SELECT id FROM Members WHERE id = $1",
      [member_id]
    );
    if (memberCheck.rows.length === 0) {
      return res.status(400).json({ error: "Member ID does not exist" });
    }

    // Insert payment information into the database, using parameterized query for security
    const { rows } = await pool.query(
      "INSERT INTO payments (member_id, amount, payment_date, service, completion_status) VALUES ($1, $2, $3, $4, $5) RETURNING *;",
      [member_id, amount, payment_date, service, completion_status]
    );

    // Respond with the newly created payment entry
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Could not create payment" });
  }
};

const addFitnessGoal = async (req, res) => {
  try {
    const { member_id, goal, completion_date, status } = req.body;

    // Validate 'member_id'
    if (typeof member_id !== "number" || member_id <= 0) {
      return res.status(400).json({ error: "Invalid or missing member ID." });
    }

    // Validate 'goal'
    if (typeof goal !== "string" || !goal.trim()) {
      return res.status(400).json({ error: "Invalid or missing goal text." });
    }

    // Validate 'completion_date'
    if (
      typeof completion_date !== "string" ||
      !/^(\d{4})-(\d{2})-(\d{2})$/.test(completion_date)
    ) {
      return res.status(400).json({
        error:
          "Invalid or missing completion date. Format should be YYYY-MM-DD.",
      });
    }

    // 'status' is a boolean; ensure it's provided as such since the default is managed by PostgreSQL
    if (status !== undefined && typeof status !== "boolean") {
      return res
        .status(400)
        .json({ error: "Invalid status. Must be true or false." });
    }

    // Inserting the new fitness goal into the database
    const insertQuery = `
        INSERT INTO Fitness_Goals (member_id, goal, completion_date, status)
        VALUES ($1, $2, $3, $4)
        RETURNING id, member_id, goal, completion_date, status;
      `;
    // Handle the default value for 'status' by explicitly checking if it's undefined
    const values = [
      member_id,
      goal,
      completion_date,
      status !== undefined ? status : false,
    ];
    const { rows } = await pool.query(insertQuery, values);

    // Respond with the newly created fitness goal
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Could not add the fitness goal to the database." });
  }
};
