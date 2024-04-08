const pool = require("../db");

const getRoomSchedule = async (req, res, next) => {
    try {
        const roomId = parseInt(req.params.id);
        console.log("Room ID:", roomId);
        const query = `
          SELECT start_time, end_time, day FROM Classes 
          WHERE room_id = $1;
        `;
        const { rows } = await pool.query(query, [roomId]);

        const availableTimeSlots = [];

        for (let i = 0; i < 7; i++) {
          const classes = rows.filter((classTime) => classTime.day === i);
          availableTimeSlots.push({
            day: i,
            timeSlots: [],
          });

          let start = "00:00:00"
          let end = "24:00:00"

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


        res.json(availableTimeSlots);
      } catch (err) {
        console.error(err);
        res.status(500).send("Server error while retrieving room schedule.");
      }
}

const getAllRooms = async (req, res, next) => {
    try {
        const query = "SELECT * FROM Rooms";
        const { rows } = await pool.query(query);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error while retrieving rooms.");
    }
}

module.exports = { getRoomSchedule, getAllRooms };