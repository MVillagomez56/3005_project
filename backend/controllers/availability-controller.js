const pool = require("../db");

const generateDetailedTimeSlots = () => {
  const detailedSlots = [];
  for (let hour = 0; hour < 24; hour++) {
    const startHour = String(hour).padStart(2, '0');
    const endHour = String((hour + 1) % 24).padStart(2, '0'); // Wrap around at 24 to 00
    detailedSlots.push({
      startTime: `${startHour}:00`,
      endTime: `${endHour}:00`
    });
  }
  return detailedSlots;
};

function parseTime(timeString) {
  // Assuming timeString is in 'HH:MM:SS' format
  const timeParts = timeString.split(':');
  const date = new Date();
  date.setHours(parseInt(timeParts[0], 10));
  date.setMinutes(parseInt(timeParts[1], 10));
  date.setSeconds(timeParts[2] ? parseInt(timeParts[2], 10) : 0);
  return date;
}

const getRoomTrainerAvailability = async (req, res, next) => {
  const { roomId, trainerId, day } = req.query;

  try {
    // Fetch trainer's schedule for the specified day
    const scheduleRes = await pool.query(
      `SELECT start_time, end_time FROM Schedule
       WHERE trainer_id = $1 AND day = $2;`,
      [trainerId, day]
    );

    const trainerSchedule = scheduleRes.rows[0]; // Assuming one schedule per trainer per day

    // Fetch occupied slots from the database
    const occupiedSlotsRes = await pool.query(
      `SELECT start_time, end_time FROM Classes
       WHERE (room_id = $1 OR trainer_id = $2) AND day = $3
       ORDER BY start_time;`,
      [roomId, trainerId, day]
    );

    const occupiedSlots = occupiedSlotsRes.rows;

    // Generate all possible detailed time slots for a day
    const allSlots = generateDetailedTimeSlots();

    // First filter: Remove slots outside the trainer's working hours
// Assuming trainerSchedule.start_time and trainerSchedule.end_time are available and formatted as 'HH:MM'
const withinScheduleSlots = allSlots.filter(slot => {
  // Normalize times to 'HH:MM' format for comparison
  const formatTime = (time) => time.slice(0, 5); // Cuts off seconds if present
  
  const slotStartTime = formatTime(slot.startTime);
  const slotEndTime = formatTime(slot.endTime === '00:00' ? '24:00' : slot.endTime);
  const scheduleStartTime = formatTime(trainerSchedule.start_time);
  const scheduleEndTime = formatTime(trainerSchedule.end_time === '00:00' ? '24:00' : trainerSchedule.end_time);

  // Compare times in 'HH:MM' format
  return slotStartTime >= scheduleStartTime && slotEndTime <= scheduleEndTime;
});


    // Second filter: Remove slots that overlap with occupied slots
    const availableSlots = withinScheduleSlots.filter(slot => {
      return !occupiedSlots.some(occupied => {
        const slotStart = slot.startTime;
        const slotEnd = slot.endTime;
        const occupiedStart = occupied.start_time;
        const occupiedEnd = occupied.end_time;

        // Slot starts before occupied ends and slot ends after occupied starts (overlap condition)
        return (slotStart < occupiedEnd && slotEnd > occupiedStart);
      });
    });

    console.log('Available slots:', availableSlots);
    res.json({ availableSlots });
  } catch (error) {
    console.error('Failed to fetch availability:', error);
    res.status(500).send('Error fetching availability');
  }
};

const checkAvailability = async (req, res) => {
  const { roomId, trainerId, day, startTime, endTime } = req.body;
  console.log("triggered!");

  console.log("day is" + day);

  try {
    console.log("check 1");
    // Fetch trainer's schedule for the specified day
    const scheduleRes = await pool.query(
      `SELECT start_time, end_time FROM Schedule WHERE trainer_id = $1 AND day = $2;`,
      [trainerId, day]
    );

        console.log("check 2");
    // If the trainer does not have a schedule for the day, the slot is not available
    if (scheduleRes.rows.length === 0) {
      return res.status(200).json({ isAvailable: false });
    }

    const trainerSchedule = scheduleRes.rows[0];

        console.log("check 3");
    // Fetch all classes that either use the room or the trainer for the specified day
    const occupiedSlotsRes = await pool.query(
      `SELECT start_time, end_time FROM Classes
       WHERE (room_id = $1 OR trainer_id = $2) AND day = $3;`,
      [roomId, trainerId, day]
    );

        console.log("check 4");
    const occupiedSlots = occupiedSlotsRes.rows;

        console.log("check 5");
    // Check if requested slot is within the trainer's working hours
    const startTimeDate = parseTime(startTime);
    const endTimeDate = parseTime(endTime);
    const trainerStartTime = parseTime(trainerSchedule.start_time);
    const trainerEndTime = parseTime(trainerSchedule.end_time);
    console.log("start time is" + startTimeDate);
    console.log("end time is" + endTimeDate);
    console.log("Trainer start time is" + trainerStartTime);
    console.log("Trainer end time is" + trainerEndTime);
    const isWithinWorkingHours =
      startTimeDate >= trainerStartTime &&
      endTimeDate <= trainerEndTime;

    if (!isWithinWorkingHours) {
      return res.status(200).json({ isAvailable: false });
    }

        console.log("check 6");
    console.log('Occupied slots:', occupiedSlots)
    // Check if requested slot overlaps with any occupied slots
    const isSlotAvailable = !occupiedSlots.some(occupied => {
      console.log("occupied start is" + occupied.start_time);
      console.log("occupied end is" + occupied.end_time);

      console.log("start time is" + startTime);
      console.log("end time is" + endTime);
      return (
        (startTime < occupied.end_time && endTime > occupied.start_time)
      );
    });

    // Respond with the availability of the slot
    res.status(200).json({ isAvailable: isSlotAvailable });
  } catch (error) {
    console.error('Failed to check availability:', error);
    res.status(500).send('Error checking availability');
  }
};


module.exports = {
  getRoomTrainerAvailability,
  checkAvailability
}