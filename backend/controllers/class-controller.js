const getAllRooms = async(req,res,next)=>{
    try {
        const { rows } = await pool.query("SELECT * FROM Rooms");
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error while retrieving rooms.");
    }
}

const getAllClass = async(req,res,next)=>{
    try {
        const { rows } = await pool.query("SELECT * FROM Classes");
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error while retrieving classes.");
    }
}

const getAllMembers = async(req,res,next)=>{
    try {
        const { rows } = await pool.query("SELECT * FROM Members");
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error while retrieving members.");
    }
}

const getAllEquipment = async(req,res,next)=>{
    try {
        const { rows } = await pool.query("SELECT * FROM Equipment");
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error while retrieving equipment.");
    }
}

const getPopularClass = async(req,res,next)=>{
    try {
        const query = `
            SELECT c.id, c.name, COUNT(cm.member_id) as member_count 
            FROM Classes c
            JOIN Classes_Members cm ON c.id = cm.class_id
            GROUP BY c.id
            ORDER BY member_count DESC
            LIMIT 1
        `;
        const { rows } = await pool.query(query);
        if (rows.length === 0) {
            return res.status(404).send("No classes found.");
        }
        res.json(rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error while retrieving the popular class.");
    }
}


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
        return res
          .status(400)
          .json({
            error:
              "Invalid or missing duration. Ensure it matches TSRANGE format.",
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
  