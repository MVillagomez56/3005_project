const pool = require("../db");

// Rooms
const getAllRooms = async (req, res, next) => {
  try {
    const { rows } = await pool.query("SELECT * FROM Rooms");
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error while retrieving rooms.");
  }
};

const getRoomById = async (req, res, next) => {
  const roomId = parseInt(req.params.id);

  if (isNaN(roomId)) {
    return res.status(400).json({ error: "Invalid room ID." });
  }

  try {
    const query = "SELECT * FROM Rooms WHERE id = $1";
    const { rows } = await pool.query(query, [roomId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Room not found." });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "An error occurred while retrieving the room." });
  }
  
}

const getAllClasses = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT 
        Classes.id, Classes.name, Classes.description, Classes.duration, Classes.cost, Classes.capacity, Classes.type, Classes.room_id, Classes.trainer_id, 
        Trainers.specialization, Trainers.cost AS trainer_cost, Users.name AS trainer_name, 
        Rooms.name AS room_name, Rooms.description AS room_description, Rooms.capacity AS room_capacity
      FROM Classes
      JOIN Trainers ON Classes.trainer_id = Trainers.id
      JOIN Users ON Trainers.id = Users.id
      JOIN Rooms ON Classes.room_id = Rooms.id
      ORDER BY Classes.id;`
    );
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving classes." });
  }
};

const getAllEquipment = async (req, res, next) => {
  try {
    const { rows } = await pool.query("SELECT * FROM Equipment");
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error while retrieving equipment.");
  }
};

const getPopularClasses = async (req, res, next) => {
  try {
    const query = `
            SELECT c.id, c.name, c.description, COUNT(cm.member_id) as member_count, c.start_time, c.end_time, c.day, c.cost, c.capacity, c.type, c.room_id, c.trainer_id
            FROM Classes c
            JOIN Classes_Members cm ON c.id = cm.class_id
            GROUP BY c.id
            ORDER BY member_count DESC
            LIMIT 3;
        `;
    const { rows } = await pool.query(query);
    if (rows.length === 0) {
      return res.status(404).send("No classes found.");
    }
    res.json(rows);
    console.log(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error while retrieving the popular class.");
  }
};

const getUpcomingClasses = async (req, res, next) => {
  try {
    console.log(req);
    const member_id = req.params.id;
    const query = `
            SELECT c.id, c.name, c.description, c.start_time, c.end_time, c.day, c.cost, c.capacity, c.type, c.room_id, c.trainer_id,
            r.name AS room_name, r.description AS room_description, r.capacity AS room_capacity,
            t.specialization, t.cost AS trainer_cost, u.name AS trainer_name
            FROM Classes c
            JOIN Rooms r ON c.room_id = r.id
            JOIN Trainers t ON c.trainer_id = t.id
            JOIN Users u ON t.id = u.id
            WHERE c.id IN (
                SELECT class_id
                FROM Classes_Members
                WHERE member_id = $1
            )
            ORDER BY c.start_time;
        `;

    const { rows } = await pool.query(query, [member_id]);
    if (rows.length === 0) {
      return res.status(404).send("No upcoming classes found.");
    }
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error while retrieving upcoming classes.");
  }
};

//Post
const addClass = async (req, res) => {
  try {
    const {
      name,
      description,
      trainer_id,
      duration,
      cost,
      capacity,
      type,
      room_id,
    } = req.body;

    // Validate 'name'
    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ error: "Invalid or missing class name." });
    }

    // Validate 'trainer_id'
    if (typeof trainer_id !== "number" || trainer_id <= 0) {
      return res.status(400).json({ error: "Invalid or missing trainer ID." });
    }

    // Validate 'duration' - specific validation depends on your input format
    if (
      typeof duration !== "string" ||
      !duration.match(/^\[\'.*\'\, \'.*\'\]$/)
    ) {
      return res.status(400).json({
        error: "Invalid or missing duration. Ensure it matches TSRANGE format.",
      });
    }

    // Validate 'cost'
    if (typeof cost !== "number" || cost < 0) {
      return res.status(400).json({ error: "Invalid or negative cost." });
    }

    // Validate 'capacity'
    if (typeof capacity !== "number" || capacity <= 0) {
      return res
        .status(400)
        .json({ error: "Invalid or non-positive capacity." });
    }

    // Validate 'room_id'
    if (typeof room_id !== "number" || room_id <= 0) {
      return res.status(400).json({ error: "Invalid or missing room ID." });
    }

    // Check if 'trainer_id' exists in 'Trainers' table
    const trainerExists = await pool.query(
      "SELECT id FROM Trainers WHERE id = $1",
      [trainer_id]
    );
    if (trainerExists.rows.length === 0) {
      return res.status(400).json({ error: "Trainer does not exist." });
    }

    // Check if 'room_id' exists in 'Rooms' table
    const roomExists = await pool.query("SELECT id FROM Rooms WHERE id = $1", [
      room_id,
    ]);
    if (roomExists.rows.length === 0) {
      return res.status(400).json({ error: "Room does not exist." });
    }

    // Inserting the new class into the database
    const insertQuery = `
          INSERT INTO Classes (name, description, trainer_id, duration, cost, capacity, type, room_id)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          RETURNING *;
        `;
    const values = [
      name,
      description,
      trainer_id,
      duration,
      cost,
      capacity,
      type,
      room_id,
    ];
    const { rows } = await pool.query(insertQuery, values);

    // Respond with the newly created class entry
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not add the class to the database." });
  }
};

const getClassById = async (req, res) => {
  const classId = parseInt(req.params.id);

  if (isNaN(classId)) {
    return res.status(400).json({ error: "Invalid class ID." });
  }

  try {
    const query = `
        SELECT id, name, description, trainer_id, duration, cost, capacity, type, room_id 
        FROM Classes 
        WHERE id = $1;
      `;
    const { rows } = await pool.query(query, [classId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Class not found." });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving the class." });
  }
};

const updateClassById = async (req, res) => {
  const { id } = req.params; // The class ID from URL
  const { name, description, trainer_id, duration, cost, capacity, type, room_id } = req.body; // Destructure updated class data from request body

  try {
    // Construct the SQL query for updating the class information
    const updateQuery = `
      UPDATE Classes
      SET name = $1, description = $2, trainer_id = $3, duration = $4, cost = $5, capacity = $6, type = $7, room_id = $8
      WHERE id = $9
      RETURNING *;
    `;

    // Execute the query with parameters
    const { rows } = await pool.query(updateQuery, [name, description, trainer_id, duration, cost, capacity, type, room_id, id]);

    // If no rows are returned, the class was not found
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Class not found.' });
    }

    // Respond with the updated class information
    res.status(200).json(rows[0]);
  } catch (err) {
    console.error('Error updating class:', err);
    res.status(500).json({ error: 'An error occurred while updating the class information.' });
  }
};

module.exports = {
  getAllRooms,
  getAllClasses,
  getAllEquipment,
  getClassById,
  getPopularClasses,
  addClass,
  getUpcomingClasses,
  updateClassById,
  getRoomById,
};
