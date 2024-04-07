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
        res.json(rows);
      } catch (err) {
        console.error(err);
        res.status(500).send("Server error while retrieving room schedule.");
      }
}

module.exports = { getRoomSchedule };