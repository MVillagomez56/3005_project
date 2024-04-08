// USE FOR USER AUTHENTICATION
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const pool = require("../db");

const dayMappings = { 
  "Monday": 1, 
  "Tuesday": 2, 
  "Wednesday": 3, 
  "Thursday": 4, 
  "Friday": 5, 
  "Saturday": 6, 
  "Sunday": 7 
};


// Get
const getUserById = async (req, res, next) => {
  console.log("getUserById");
  const userId = parseInt(req.params.id);

  // Validate that the provided ID is a number
  if (isNaN(userId)) {
    return res.status(400).json({ error: "Invalid user ID." });
  }

  try {
    const { rows } = await pool.query(
      "SELECT * FROM Users WHERE id = $1;",
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

const getAllMembers = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      "SELECT m.id, u.name, m.weight, m.height, m.muscle_mass, m.body_fat FROM Members m JOIN Users u ON m.id = u.id ORDER BY m.id;"
    );
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving members." });
  }
};

const getMemberById = async (req, res, next) => {
  const userId = parseInt(req.params.userid); // Convert the userid from string to integer

  // Validate that the provided ID is a number
  if (isNaN(userId)) {
    return res.status(400).json({ error: "Invalid user ID provided." });
  }

  try {
    const { rows } = await pool.query(
      "SELECT * FROM Members m WHERE m.id = $1;",
      [userId]
    );

    // Check if a member was found
    if (rows.length === 0) {
      return res.status(404).json({ error: "Member not found." });
    }

    res.json(rows[0]); // Send the found member
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving the member." });
  }
};

const getFitnessGoals = async (req, res, next) => {
  try {
    const member_id = parseInt(req.params.member_id);
    console.log("member_id", member_id);

    if (typeof member_id !== "number" || member_id <= 0) {
      console.log("Invalid member ID.");
      return res.status(400).json({ error: "Invalid member ID." });
    }

    const { rows } = await pool.query(
      "SELECT * FROM fitness_goals WHERE member_id = $1 ORDER BY id ASC;",
      [member_id]
    );

    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving fitness goals." });
  }
};

const addFitnessGoal = async (req, res, next) => {
  try {
    const { goal } = req.body;
    const member_id = parseInt(req.params.member_id);

    if (typeof member_id !== "number" || member_id <= 0) {
      return res.status(400).json({ error: "Invalid member ID." });
    }

    if (typeof goal !== "string" || !goal.trim()) {
      return res.status(400).json({ error: "Invalid goal." });
    }

    const { rows } = await pool.query(
      "INSERT INTO fitness_goals (member_id, goal) VALUES ($1, $2) RETURNING *;",
      [member_id, goal]
    );

    console.log("rows", rows);

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "An error occurred while adding the goal." });
  }
};

const updateFitnessGoal = async (req, res, next) => {
  try {
    const { goal } = req.body;
    const goal_id = parseInt(req.params.goal_id);

    if (typeof goal_id !== "number" || goal_id <= 0) {
      return res.status(400).json({ error: "Invalid goal ID." });
    }

    if (typeof goal !== "string" || !goal.trim()) {
      return res.status(400).json({ error: "Invalid goal." });
    }

    const { rows } = await pool.query(
      "UPDATE fitness_goals SET goal = $1 WHERE id = $2 RETURNING *;",
      [goal, goal_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Goal not found." });
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ error: "An error occurred while updating the goal." });
  }
};

const completeFitnessGoal = async (req, res, next) => {
  try {
    const goal_id = parseInt(req.params.goal_id);

    const { status } = req.body;

    if (typeof goal_id !== "number" || goal_id <= 0) {
      return res.status(400).json({ error: "Invalid goal ID." });
    }

    if (typeof status !== "boolean") {
      return res.status(400).json({ error: "Invalid status." });
    }

    const { rows } = await pool.query(
      "UPDATE fitness_goals SET status = $1 WHERE id = $2 RETURNING *;",
      [status, goal_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Goal not found." });
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ error: "An error occurred while completing the goal." });
  }
};

const deleteFitnessGoal = async (req, res, next) => {
  try {
    const goal_id = parseInt(req.params.goal_id);

    if (typeof goal_id !== "number" || goal_id <= 0) {
      return res.status(400).json({ error: "Invalid goal ID." });
    }

    const { rows } = await pool.query(
      "DELETE FROM fitness_goals WHERE id = $1 RETURNING *;",
      [goal_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Goal not found." });
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the goal." });
  }
};

const searchMember = async (req, res) => {
  console.log("Trigger!");
  const id = parseInt(req.query.id);
  const name = req.query.name;

  try {
    if (!id && !name) {
      return res.status(400).json({ error: "Please provide a valid ID or name" });
    }

    console.log("id", id);
    console.log("name", name);

    let updateQuery = `SELECT * FROM Members m JOIN Users u ON m.id = u.id`;
    let values = [];
    let valueIndex = 1;

    if (id) {
      updateQuery += ` WHERE m.id = $${valueIndex}`;
      values.push(id);
      valueIndex++;
    }

    //if name is provided and id exists ignore name
    // check if name is similar to any name in the database
    if (name && !id) {
      updateQuery += ` WHERE u.name ILIKE $${valueIndex}`;
      values.push(`%${name}%`);
      valueIndex++;
    }
  
    const { rows } = await pool.query(updateQuery, values);

    if (rows.length > 0) {
      console.log(rows);
      res.json(rows);
    } else {
      res.status(404).json({ message: "Member not found" });
    }
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ error: "An error occurred while searching for the member." });
  }
};

// Function to get all trainers and their PF sessions
const getAllTrainersWithPF = async (req, res) => {
  try {
    // SQL query to fetch trainers with their names from the Users table
    const trainersQuery = `
      SELECT 
        t.id, 
        u.name, 
        t.specialization
      FROM 
        Trainers t
      JOIN 
        Users u ON t.id = u.id
      WHERE 
        u.role = 'trainer';
    `;

    const { rows } = await pool.query(trainersQuery);

    // Formatting the trainers' data for the response
    const trainers = rows.map((trainer) => ({
      id: trainer.id,
      name: trainer.name,
      specialization: trainer.specialization,
    }));

    res.json(trainers);
  } catch (error) {
    console.error("Error fetching trainers:", error);
    res.status(500).json({
      error: "An error occurred while retrieving trainers.",
    });
  }
};

const getTrainerDetailById = async (req, res) => {
  try {
    const trainerId = parseInt(req.params.id); // Get the trainer ID from the request parameters

    // SQL query to fetch the trainer's details from the Trainers and Users tables
    const trainerDetailQuery = `
      SELECT 
        t.id, 
        u.name, 
        t.specialization,
        t.cost
      FROM 
        Trainers t
      JOIN 
        Users u ON t.id = u.id
      WHERE 
        t.id = $1 AND u.role = 'trainer';
    `;

    // Execute the trainer detail query
    const trainerResult = await pool.query(trainerDetailQuery, [trainerId]);

    // Check if the trainer was found
    if (trainerResult.rows.length === 0) {
      return res.status(404).json({ error: "Trainer not found." });
    }

    // Assuming there's only one match due to ID uniqueness for trainer details
    const trainer = trainerResult.rows[0];

    // Format the trainer's data for the response
    const formattedTrainer = {
      id: trainer.id,
      name: trainer.name,
      specialization: trainer.specialization,
      cost: trainer.cost
    };

    res.json(formattedTrainer);
  } catch (error) {
    console.error("Error fetching trainer details:", error);
    res.status(500).json({
      error: "An error occurred while retrieving the trainer's details.",
    });
  }
};




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
        RETURNING id, email, name, date_of_birth, role, password;
      `;
    const values = [email, password, name, date_of_birth, role];
    const { rows } = await pool.query(insertQuery, values);

    // Send success response
    res.status(201).json({ user: { ...rows[0], has_payment_method: false } });
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
    console.log("req.body", req.body);

    const { email, password } = req.body;
    //check if email and password are strings
    if (typeof email !== "string" || !email.trim()) {
      return res.status(400).json({ error: "Invalid email" });
    }
    if (typeof password !== "string" || !password.trim()) {
      return res.status(400).json({ error: "Invalid password" });
    }

    // Check if the user exists in the database
    const { rows } = await pool.query("SELECT * FROM Users WHERE email = $1;", [
      email,
    ]);

    if (rows[0] == undefined) {
      console.log("User not found");
      return res.status(401).json({ error: "User not found" });
    }

    // Check if the password is correct
    const user = rows[0];
    // const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("user", user);
    if (password !== user.password) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    // STRECTH GOAL: Generate a JWT token
    // const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    //   expiresIn: "1h",
    // });

    res.status(200).json({
      user: {
        ...user,
        has_payment_method: !!user.cc_number,
      },
    }); // send user object to be stored in local storage and state
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not log in user" });
  }
};

// add payment
const addPayment = async (req, res, next) => {
  try {
    // Destructure payment information from request body
    const { member_id, amount, payment_date, service } = req.body;

    
    const amountNum = parseFloat(amount);

    // Basic validation
    if (typeof member_id !== "number" || member_id <= 0) {
      return res.status(400).json({ error: "Invalid member ID" });
    }
    if (typeof amountNum !== "number" || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    let serviceName;

    //if service is number, fetch relevant class
    if (service!== "membership") {
        const query= "SELECT * FROM classes WHERE id = $1";
        const { rows } = await pool.query(query, [service]);
        if (rows.length === 0) {
            return res.status(404).json({ error: "Class not found." });
        }
        serviceName = rows[0].type + " fitness class";

    } else {
        serviceName = "membership";
    }

    const memberCheck = await pool.query(
      "SELECT id FROM Members WHERE id = $1",
      [member_id]
    );
    if (memberCheck.rows.length === 0) {
      return res.status(400).json({ error: "Member ID does not exist" });
    }

    // Insert payment information into the database, using parameterized query for security
    // if service is a number, pass it as a number to class_id. if not, pass null

    const queryText = `
      INSERT INTO payments (member_id, amount, service, date, class_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    let values = [member_id, amountNum, serviceName, payment_date];
    if (service !== "membership") {
      values.push(service);
    } else {
      values.push(null);
    }

    const { rows } = await pool.query(queryText, values);

    // Respond with the newly created payment entry
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Could not create payment" });
  }
};

const addFitnessGoals = async (req, res) => {
  try {
    const { goals } = req.body;
    console.log("req", req);
    const member_id = parseInt(req.params.member_id);
    //add back in memberid
    if (typeof member_id !== "number" || member_id <= 0) {
      return res.status(400).json({ error: "Invalid or missing member ID." });
    }

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
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Could not add the fitness goal to the database." });
  }
};

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
    const { weight, height, muscle_mass, body_fat } = req.body;

    console.log("req.body", req.body)

   //DEPENDING ON WHICH FIELDS ARE PASSED IN, UPDATE THE CORRESPONDING FIELDS
    let updateQuery = `UPDATE Members SET `;
    let values = [];
    let valueIndex = 1;


    if (weight) {
      console.log("weight", weight);
      updateQuery += `weight = $${valueIndex}, `;
      values.push(weight);
      valueIndex++;
    }
    if (height) {
      updateQuery += `height = $${valueIndex}, `;
      values.push(height);
      valueIndex++;
    }
    if (muscle_mass) {
      updateQuery += `muscle_mass = $${valueIndex}, `;
      values.push(muscle_mass);
      valueIndex++;
    }
    if (body_fat) {
      updateQuery += `body_fat = $${valueIndex}, `;
      values.push(body_fat);
      valueIndex++;
    }


    // Remove the trailing comma and space
    updateQuery = updateQuery.slice(0, -2);

    // Add the WHERE clause to update the correct member
    updateQuery += ` WHERE id = $${valueIndex} RETURNING *;`;
    values.push(member_id);
    console.log("updateQuery", updateQuery);


    // Update the member in the database
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

const updateUser = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id); // Convert the user ID from string to integer

    // Validate that the provided ID is a number
    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID provided." });
    }

    // Extract user details from request body
    const { name, email, password, date_of_birth } = req.body;

    // Update the user in the database
    const updateQuery = `
        UPDATE Users
        SET email = $1, name = $2, date_of_birth = $3, password = $4
        WHERE id = $5
        RETURNING *;
      `;
    const values = [email, name, date_of_birth, password, userId];
    const { rows } = await pool.query(updateQuery, values);

    // Check if a user was found and updated
    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json(rows[0]); // Send the updated user
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ error: "An error occurred while updating the user." });
  }
};

const registerPersonalTraining = async (req, res) => {
  const { userId, slots, duration } = req.body;
  const trainerId = parseInt(req.params.id, 10); 

  try {
    // Fetch the trainer's hourly rate and name from the Trainers table
    // by joining with the Users table
    const trainerQuery = `
      SELECT Users.name, Trainers.cost 
      FROM Trainers 
      INNER JOIN Users ON Trainers.id = Users.id 
      WHERE Trainers.id = $1
    `;
    const trainerResult = await pool.query(trainerQuery, [trainerId]);
    if (trainerResult.rows.length === 0) {
      return res.status(404).json({ error: 'Trainer not found.' });
    }
    const trainer = trainerResult.rows[0];
    const totalCost = trainer.cost * parseInt(duration, 10); // Calculate total cost based on duration

    for (const slot of slots) {
      const slotParts = slot.slotKey.split('-');
      const dayOfWeek = slotParts[0];
      const day = dayMappings[dayOfWeek]; // Convert weekday name to int

      if (!day) {
        throw new Error(`Invalid dayOfWeek '${dayOfWeek}' received in slotKey '${slot.slotKey}'`);
      }

      const startTime = slot.startTime;
      let startTimeDate = new Date(`1970-01-01T${startTime}Z`);
      startTimeDate.setHours(startTimeDate.getHours() + parseInt(duration, 10));
      let endTime = startTimeDate.toISOString().substr(11, 5);

      const name = `${req.body.userName} and ${trainer.name} personal`;
      const description = `Personal training session with ${trainer.name}`;

      const queryText = `
        INSERT INTO Classes (name, description, trainer_id, start_time, end_time, day, cost, capacity, type, room_id, approval_status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, 1, 'personal', 1, false)
        RETURNING id
      `;
      const values = [name, description, trainerId, startTime, endTime, day, totalCost];

      // Insert class and capture the returned class ID
      const classResult = await pool.query(queryText, values);
      const classId = classResult.rows[0].id;

      // Insert record into Classes_Members
      const insertClassMemberQuery = `
        INSERT INTO Classes_Members (class_id, member_id)
        VALUES ($1, $2)
      `;
      await pool.query(insertClassMemberQuery, [classId, userId]);
    }

    res.status(200).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Registration failed:', error);
    res.status(500).json({ error: 'Failed to process registration: ' + error.message });
  }
};

const getRooms = async (req, res) => {
  try {
    const roomsQuery = `SELECT id, name, description FROM Rooms;`;
    const roomsResult = await pool.query(roomsQuery);
    res.status(200).json(roomsResult.rows);
  } catch (error) {
    console.error('Failed to fetch rooms:', error);
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
};

const getTrainerSchedule = async (req, res) => {
  const trainerId = parseInt(req.params.id); // Assuming the ID is passed as a URL parameter
  try {
    const scheduleQuery = `
      SELECT day, start_time, end_time
      FROM Schedule
      WHERE trainer_id = $1;
    `;
    const scheduleResult = await pool.query(scheduleQuery, [trainerId]);
    res.status(200).json(scheduleResult.rows);
  } catch (error) {
    console.error(`Failed to fetch schedule for trainer ${trainerId}:`, error);
    res.status(500).json({ error: `Failed to fetch schedule for trainer ${trainerId}` });
  }
};



module.exports = {
  getUserById,
  getMemberById,
  login,
  register,
  updateMember,
  addFitnessGoals,
  updateMemberPaymentInfo,
  addPayment,
  searchMember,
  getAllTrainersWithPF,
  updateUser,
  getFitnessGoals,
  addFitnessGoal,
  updateFitnessGoal,
  completeFitnessGoal,
  deleteFitnessGoal,
  getTrainerDetailById,
  registerPersonalTraining,
  getRooms,
  getTrainerSchedule,
};
