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

module.exports = {
  getTrainerSchedule,
  updateTrainerSchedule,
  getTrainerCourses,
  getTrainerAvailableTimeSlots,
};
