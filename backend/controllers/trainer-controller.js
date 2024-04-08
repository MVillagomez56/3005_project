const pool = require("../db");

const getTrainerSchedule = async (req, res, next) => {
  try {
    const trainerId = parseInt(req.params.id);
    const query = `
          SELECT * FROM Schedule 
          WHERE trainer_id = $1;
        `;
    const { rows } = await pool.query(query, [trainerId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error while retrieving trainer schedule.");
  }
};


const getAllValidTrainers = async (req, res, next) => {
  try {
    // Query to select trainers with both specialization and cost defined
    const queryText = `
      SELECT * FROM Trainers
      WHERE specialization IS NOT NULL AND cost IS NOT NULL;
    `;

    // Execute query
    const { rows } = await pool.query(queryText);

    // Send response back with trainers
    res.status(200).json({
      status: 'success',
      data: {
        trainers: rows,
      },
    });
  } catch (err) {
    // Log and forward the error if any
    console.error(err.message);
    next(err);
  }
};

const getTrainerAvailableTimeSlots = async (req, res, next) => {
  try {
    const trainerId = parseInt(req.params.id);
    const query = `
          SELECT * FROM Schedule 
          WHERE trainer_id = $1;
        `;
    const { rows: scheduleTime } = await pool.query(query, [trainerId]);

    const query2 = `
          SELECT start_time, end_time, day FROM Classes
          WHERE trainer_id = $1;
        `;

    const { rows: classTime } = await pool.query(query2, [trainerId]);

    const availableTimeSlots = [];

    for (let i = 0; i < 7; i++) {
      const schedule = scheduleTime.find((schedule) => schedule.day === i);
      const classes = classTime.filter((classTime) => classTime.day === i);

      if (!schedule) {
        availableTimeSlots.push({
          day: i,
          timeSlots: [{ start: 0, end: 24 }],
        });
      } else {
        availableTimeSlots.push({
          day: i,
          timeSlots: [],
        });
        let start = schedule.start_time;
        let end = schedule.end_time;

        for (const classTime of classes) {
          if (classTime.start_time >= start && classTime.start_time < end) {
            availableTimeSlots[i].timeSlots.push({
              start: start,
              end: classTime.start_time,
            });
          }
          start = classTime.end_time;
        }

        if (start < end) {
          availableTimeSlots[i].timeSlots.push({
            start: start,
            end: end,
          });
        }
      }
    }

    console.log(availableTimeSlots);

    res.json(availableTimeSlots);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error while retrieving trainer schedule.");
  }
};

const updateTrainerSchedule = async (req, res, next) => {
  const { start_time, end_time } = req.body;
  const trainerId = parseInt(req.params.id);
  const day = parseInt(req.body.day); // Ensure 'day' is parsed as an integer if it's not already

  try {
    const query = `
        UPDATE Schedule
        SET start_time = $1, end_time = $2
        WHERE trainer_id = $3 AND day = $4;
      `;
    const { rowCount } = await pool.query(query, [
      start_time,
      end_time,
      trainerId,
      day,
    ]);

    if (rowCount > 0) {
      res.send("Schedule updated successfully.");
    } else {
      res.status(404).send("Schedule not found.");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to update the schedule.");
  }
};

const getTrainerCourses = async (req, res, next) => {
  try {
    const trainerId = parseInt(req.params.id);
    const query = `
          SELECT * FROM Classes
          WHERE trainer_id = $1;
        `;
    const { rows } = await pool.query(query, [trainerId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error while retrieving trainer courses.");
  }
};

const updateTrainer = async (req, res, next) => {
  const id = parseInt(req.params.id);
  try {
    const { specialization, cost } = req.body;
    const query = `
      UPDATE Trainers
      SET specialization = $1, cost = $2
      WHERE id = $3
      RETURNING *;
    `;

    const { rows } = await pool.query(query, [specialization, cost, id]);

    if (rows.length == 0) {
      res.status(404).send("Trainer not found");
    }
    res.status(200).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to update trainer.");
  }
};

const addTrainerSchedule = async (req, res, next) => {
  const { scheduledHours } = req.body;
  const trainerId = parseInt(req.params.id);

  try {
    for (let i = 0; i < scheduledHours.length; i++) {
      if (scheduledHours[i]) {
        const query = `
        INSERT INTO Schedule (trainer_id, day, start_time, end_time)
        VALUES ($1, $2, $3, $4)
        ;`;

        await pool.query(query, [
          trainerId,
          i,
          scheduledHours[i].start_time,
          scheduledHours[i].end_time,
        ]);
      }
    }

    res.status(200).send("Schedule added successfully.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to add the schedule.");
  }
};


const updateOrInsertSchedule = async (req, res) => {
  const { trainerId } = req.params;
  const { startTime, endTime, day } = req.body; // Assuming day is sent in the request

  console.log(`Received schedule for trainer ${trainerId} - Day: ${day}, Start: ${startTime}, End: ${endTime}`);

  const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  try {
    const classQuery = `
      SELECT start_time, end_time
      FROM Classes
      WHERE trainer_id = $1 AND approval_status = true AND day = $2;
    `;
    const classResult = await pool.query(classQuery, [trainerId, day]);
    const classes = classResult.rows;

    console.log(`Fetched ${classes.length} classes for conflict check.`);

    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);

    console.log(`Schedule times in minutes - Start: ${startMinutes}, End: ${endMinutes}`);

    const hasConflict = classes.some(classItem => {
      const classStartMinutes = timeToMinutes(classItem.start_time);
      const classEndMinutes = timeToMinutes(classItem.end_time);

      console.log(`Checking against class - Start: ${classStartMinutes}, End: ${classEndMinutes}`);

      const conflict = (startMinutes >= classStartMinutes) ||
                        (endMinutes <= classEndMinutes);

      console.log(`Conflict: ${conflict}`);

      return conflict;
    });

    console.log(`Conflict check result: ${hasConflict}`);

    if (hasConflict) {
      return res.status(400).json({ message: 'Schedule conflicts with an existing class.' });
    }

    const updateQuery = `
      UPDATE Schedule
      SET start_time = $1, end_time = $2
      WHERE trainer_id = $3 AND day = $4;
    `;
    const insertQuery = `
      INSERT INTO Schedule (trainer_id, day, start_time, end_time)
      SELECT $1, $2, $3, $4
      WHERE NOT EXISTS (
        SELECT 1 FROM Schedule WHERE trainer_id = $1 AND day = $2
      );
    `;

    const updateResult = await pool.query(updateQuery, [startTime, endTime, trainerId, day]);

    if (updateResult.rowCount === 0) {
      const insertResult = await pool.query(insertQuery, [trainerId, day, startTime, endTime]);
      console.log(`Insert result:`, insertResult);
    } else {
      console.log(`Update result:`, updateResult);
    }

    res.status(200).json({ message: 'Schedule updated successfully' });
  } catch (error) {
    console.error(`Failed to update schedule for trainer ${trainerId}:`, error);
    res.status(500).json({ error: `Failed to update schedule for trainer ${trainerId}` });
  }
};



const getApprovedClasses = async (req, res) => {
  console.log("getApprovedClasses");
  const trainerId = parseInt(req.params.trainerId);

  if (isNaN(trainerId)) {
    return res.status(400).json({ error: "Invalid trainer ID provided." });
  }
  try {
    const query = `
      SELECT 
        name, 
        description, 
        start_time, 
        end_time, 
        CASE day
          WHEN 1 THEN 'Monday'
          WHEN 2 THEN 'Tuesday'
          WHEN 3 THEN 'Wednesday'
          WHEN 4 THEN 'Thursday'
          WHEN 5 THEN 'Friday'
          WHEN 6 THEN 'Saturday'
          WHEN 7 THEN 'Sunday'
        END AS day,
        room_id
      FROM Classes
      WHERE trainer_id = $1 AND approval_status = true;
    `;
    const result = await pool.query(query, [trainerId]);
    //console.log(result);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(`Failed to fetch approved classes for trainer ${trainerId}:`, error);
    res.status(500).json({ error: `Failed to fetch approved classes for trainer ${trainerId}` });
  }
};



module.exports = {
  getTrainerSchedule,
  getAllValidTrainers,
  updateTrainerSchedule,
  getTrainerCourses,
  getTrainerAvailableTimeSlots,
};
