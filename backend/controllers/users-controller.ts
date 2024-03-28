// USE FOR USER AUTHENTICATION
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const pool = require("../db");

<<<<<<< HEAD

// Get
const getUserById = async (req, res, next) => {
  const userId = parseInt(req.params.id); 
=======
// Get
const getUserById = async (req, res, next) => {
  const userId = parseInt(req.params.id);
>>>>>>> 7d8605674b909fc582c7265d06ac77dc1647624b

  // Validate that the provided ID is a number
  if (isNaN(userId)) {
    return res.status(400).json({ error: "Invalid user ID." });
  }

  try {
    const { rows } = await pool.query(
      "SELECT id, email, name, date_of_birth, role FROM Users WHERE id = $1;",
<<<<<<< HEAD
      [userId] 
=======
      [userId]
>>>>>>> 7d8605674b909fc582c7265d06ac77dc1647624b
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

const getAllMembers = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      "SELECT m.id, u.name, m.weight, m.height, m.muscle_mass, m.body_fat FROM Members m JOIN Users u ON m.id = u.id ORDER BY m.id;"
    );
    res.json(rows);
  } catch (err) {
    console.error(err.message);
<<<<<<< HEAD
    res.status(500).json({ error: 'An error occurred while retrieving members.' });
=======
    res
      .status(500)
      .json({ error: "An error occurred while retrieving members." });
>>>>>>> 7d8605674b909fc582c7265d06ac77dc1647624b
  }
};

const getMemberById = async (req, res, next) => {
  const userId = parseInt(req.params.userid); // Convert the userid from string to integer

  // Validate that the provided ID is a number
  if (isNaN(userId)) {
<<<<<<< HEAD
    return res.status(400).json({ error: 'Invalid user ID provided.' });
=======
    return res.status(400).json({ error: "Invalid user ID provided." });
>>>>>>> 7d8605674b909fc582c7265d06ac77dc1647624b
  }

  try {
    const { rows } = await pool.query(
      "SELECT m.id, u.name, m.weight, m.height, m.muscle_mass, m.body_fat FROM Members m JOIN Users u ON m.id = u.id WHERE m.id = $1;",
      [userId]
    );

    // Check if a member was found
    if (rows.length === 0) {
<<<<<<< HEAD
      return res.status(404).json({ error: 'Member not found.' });
=======
      return res.status(404).json({ error: "Member not found." });
>>>>>>> 7d8605674b909fc582c7265d06ac77dc1647624b
    }

    res.json(rows[0]); // Send the found member
  } catch (err) {
    console.error(err.message);
<<<<<<< HEAD
    res.status(500).json({ error: 'An error occurred while retrieving the member.' });
  }
};



=======
    res
      .status(500)
      .json({ error: "An error occurred while retrieving the member." });
  }
};

>>>>>>> 7d8605674b909fc582c7265d06ac77dc1647624b
const registerCourse = async (req, res, next) => {};

// Post
//Add a new user
const register = async (req, res, next) => {
  try {
    // Extract user details from request body
    const { email, password, name, date_of_birth, role } = req.body;

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

    // STRECTH GOAL: Hash the password before storing it in the database
    // const hashedPassword = await bcrypt.hash(password, 10); // 10 rounds of salting

    // Insert new user into database
    const insertQuery = `
        INSERT INTO Users (email, password, name, date_of_birth, role)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, email, name, date_of_birth, role;
      `;
    const values = [email, password, name, date_of_birth, role];
    const { rows } = await pool.query(insertQuery, values);

    // Send success response
<<<<<<< HEAD
    res.status(201).json(
      {user: rows[0]}
     );
=======
    res.status(201).json({ user: rows[0] });
>>>>>>> 7d8605674b909fc582c7265d06ac77dc1647624b
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Could not create new user in the database" });
  }
};

const login = async (req, res, next) => {
  try {
    // Extract login details from request body
<<<<<<< HEAD
    console.log('req.body', req.body)
=======
    console.log("req.body", req.body);
>>>>>>> 7d8605674b909fc582c7265d06ac77dc1647624b

    const { email, password } = req.body;
    //check if email and password are strings
    if (typeof email !== "string" || !email.trim()) {
      return res.status(400).json({ error: "Invalid email" });
    }
    if (typeof password !== "string" || !password.trim()) {
      return res.status(400).json({ error: "Invalid password" });
    }

    // Check if the user exists in the database
<<<<<<< HEAD
    const { rows } = await pool.query(
      "SELECT * FROM Users WHERE email = $1;",
      [email]
    );  


    if (rows[0] == undefined) { 
=======
    const { rows } = await pool.query("SELECT * FROM Users WHERE email = $1;", [
      email,
    ]);

    if (rows[0] == undefined) {
>>>>>>> 7d8605674b909fc582c7265d06ac77dc1647624b
      console.log("User not found");
      return res.status(401).json({ error: "User not found" });
    }

    // Check if the password is correct
    const user = rows[0];
    // const isPasswordValid = await bcrypt.compare(password, user.password);
<<<<<<< HEAD
    console.log('user', user)
    if (password !== user.password) {
      return res.status(401).json({ error: "Incorrect password" });
    } 

    // STRECTH GOAL: Generate a JWT token 
=======
    console.log("user", user);
    if (password !== user.password) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    // STRECTH GOAL: Generate a JWT token
>>>>>>> 7d8605674b909fc582c7265d06ac77dc1647624b
    // const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    //   expiresIn: "1h",
    // });

<<<<<<< HEAD
    res.status(200).json({ 
      user:{
=======
    res.status(200).json({
      user: {
>>>>>>> 7d8605674b909fc582c7265d06ac77dc1647624b
        id: user.id,
        email: user.email,
        name: user.name,
        date_of_birth: user.date_of_birth,
<<<<<<< HEAD
        role: user.role
      }
     }); // send user object to be stored in local storage and state
    
=======
        role: user.role,
        has_payment_method: !!user.cc_number,
      },
    }); // send user object to be stored in local storage and state
>>>>>>> 7d8605674b909fc582c7265d06ac77dc1647624b
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not log in user" });
  }
};

<<<<<<< HEAD
// const addMember = async (req, res, next) => {
//   try {
//     // Destructure member information from request body
//     const { user_id, weight, height, muscle_mass, body_fat } = req.body;

//     // Basic validation
//     if (typeof user_id !== "number" || user_id <= 0) {
//       return res.status(400).json({ error: "Invalid user ID" });
//     }
//     if (typeof weight !== "number" || weight <= 0) {
//       return res.status(400).json({ error: "Invalid weight" });
//     }
//     if (typeof height !== "number" || height <= 0) {
//       return res.status(400).json({ error: "Invalid height" });
//     }
//     if (typeof muscle_mass !== "number" || muscle_mass <= 0) {
//       return res.status(400).json({ error: "Invalid muscle mass" });
//     }
//     if (typeof body_fat !== "number" || body_fat <= 0) {
//       return res.status(400).json({ error: "Invalid body fat percentage" });
//     }

//     // Further validation: check if user_id exists in Users table
//     const userCheck = await pool.query("SELECT id FROM Users WHERE id = $1", [
//       user_id,
//     ]);
//     if (userCheck.rows.length === 0) {
//       return res.status(400).json({ error: "User ID does not exist" });
//     }

//     // Insert member information into the database, using parameterized query for security
//     const { rows } = await pool.query(
//       "INSERT INTO Members (user_id, weight, height, muscle_mass, body_fat) VALUES ($1, $2, $3, $4, $5) RETURNING *;",
//       [user_id, weight, height, muscle_mass, body_fat]
//     );

//     // Respond with the newly created member entry
//     res.status(201).json(rows[0]);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ error: "Could not add member to the database" });
//   }
// };

=======
>>>>>>> 7d8605674b909fc582c7265d06ac77dc1647624b
// add payment
const addPayment = async (req, res, next) => {
  try {
    // Destructure payment information from request body
<<<<<<< HEAD
    const { member_id, amount, payment_date, service, completion_status } =
      req.body;
=======
    const { member_id, amount, payment_date, service } = req.body;

    const amountNum = parseFloat(amount);
>>>>>>> 7d8605674b909fc582c7265d06ac77dc1647624b

    // Basic validation
    if (typeof member_id !== "number" || member_id <= 0) {
      return res.status(400).json({ error: "Invalid member ID" });
    }
<<<<<<< HEAD
    if (typeof amount !== "number" || amount <= 0) {
=======
    if (typeof amountNum !== "number" || amount <= 0) {
>>>>>>> 7d8605674b909fc582c7265d06ac77dc1647624b
      return res.status(400).json({ error: "Invalid amount" });
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
<<<<<<< HEAD
      "INSERT INTO payments (member_id, amount, payment_date, service, completion_status) VALUES ($1, $2, $3, $4, $5) RETURNING *;",
      [member_id, amount, payment_date, service, completion_status]
=======
      "INSERT INTO payments (member_id, amount, date, service) VALUES ($1, $2, $3, $4) RETURNING *;",
      [member_id, amountNum, payment_date, service]
>>>>>>> 7d8605674b909fc582c7265d06ac77dc1647624b
    );

    // Respond with the newly created payment entry
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Could not create payment" });
  }
};

<<<<<<< HEAD
const addFitnessGoal = async (req, res) => {
  try {
    const { member_id, goal, completion_date, status } = req.body;

    // Validate 'member_id'
=======
const addFitnessGoals = async (req, res) => {
  try {
    const { goals } = req.body;
    console.log("req", req);
    const member_id = req.params.member_id;
    //add back in memberid
>>>>>>> 7d8605674b909fc582c7265d06ac77dc1647624b
    if (typeof member_id !== "number" || member_id <= 0) {
      return res.status(400).json({ error: "Invalid or missing member ID." });
    }

<<<<<<< HEAD
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
=======
    // Validate 'goals' array
    if (!Array.isArray(goals) || goals.length === 0) {
      return res.status(400).json({ error: "Invalid or missing goals." });
    }

    // Validate each goal in the array
    for (const goal of goals) {
      if (typeof goal !== "string" || !goal.trim()) {
        return res.status(400).json({ error: "Invalid goal." });
      }
    }

    // Inserting the new fitness goal into the database
    const valuesPlaceholder = goals
      .map((_, index) => `(${member_id}, $${index + 1})`)
      .join(",");

    const queryText = `INSERT INTO fitness_goals (member_id, goal) VALUES ${valuesPlaceholder} RETURNING *;`;

    const { rows } = await pool.query(queryText, goals);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Could not add the fitness goal." });
    }

    res.status(201).json(rows); // Send the newly created fitness goal
>>>>>>> 7d8605674b909fc582c7265d06ac77dc1647624b
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Could not add the fitness goal to the database." });
  }
};

<<<<<<< HEAD
=======
//put

//update members
const updateMember = async (req, res, next) => {
  try {
    const member_id = parseInt(req.params.member_id); // Convert the member ID from string to integer

    // Validate that the provided ID is a number
    if (isNaN(member_id)) {
      return res.status(400).json({ error: "Invalid member ID provided." });
    }

    // Extract member details from request body
    const { weight, height } = req.body;

    // Update the member in the database
    const updateQuery = `
        UPDATE Members
        SET weight = $1, height = $2
        WHERE id = $3
        RETURNING *;
      `;
    const values = [weight, height, member_id];
    const { rows } = await pool.query(updateQuery, values);

    // Check if a member was found and updated
    if (rows.length === 0) {
      return res.status(404).json({ error: "Member not found." });
    }

    res.json(rows[0]); // Send the updated member
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ error: "An error occurred while updating the member." });
  }
};

const updateMemberPaymentInfo = async (req, res, next) => {
  try {
    console.log("req.body", req.body);
    const member_id = parseInt(req.params.member_id); // Convert the member ID from string to integer

    // Validate that the provided ID is a number
    if (isNaN(member_id)) {
      return res.status(400).json({ error: "Invalid member ID provided." });
    }

    // Extract member details from request body
    const { cardNumber, ccv, expiryDate } = req.body;

    // Update the member in the database
    const updateQuery = `
        UPDATE Members
        SET cc_number = $1, cc_expiry_date = $2, ccv = $3
        WHERE id = $4
        RETURNING *;
      `;
    const values = [cardNumber, expiryDate, ccv, member_id];
    const { rows } = await pool.query(updateQuery, values);

    // Check if a member was found and updated
    if (rows.length === 0) {
      return res.status(404).json({ error: "Member not found." });
    }

    res.json(rows[0]); // Send the updated member
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ error: "An error occurred while updating the member." });
  }
};
>>>>>>> 7d8605674b909fc582c7265d06ac77dc1647624b

module.exports = {
  login,
  register,
<<<<<<< HEAD
}
=======
  updateMember,
  addFitnessGoals,
  updateMemberPaymentInfo,
  addPayment,
};
>>>>>>> 7d8605674b909fc582c7265d06ac77dc1647624b
