"use strict";

var pool = require("../db");

var generateDetailedTimeSlots = function generateDetailedTimeSlots() {
  var detailedSlots = [];

  for (var hour = 0; hour < 24; hour++) {
    var startHour = String(hour).padStart(2, '0');
    var endHour = String((hour + 1) % 24).padStart(2, '0'); // Wrap around at 24 to 00

    detailedSlots.push({
      startTime: "".concat(startHour, ":00"),
      endTime: "".concat(endHour, ":00")
    });
  }

  return detailedSlots;
};

function parseTime(timeString) {
  // Assuming timeString is in 'HH:MM:SS' format
  var timeParts = timeString.split(':');
  var date = new Date();
  date.setHours(parseInt(timeParts[0], 10));
  date.setMinutes(parseInt(timeParts[1], 10));
  date.setSeconds(timeParts[2] ? parseInt(timeParts[2], 10) : 0);
  return date;
}

var getRoomTrainerAvailability = function getRoomTrainerAvailability(req, res, next) {
  var _req$query, roomId, trainerId, day, scheduleRes, trainerSchedule, occupiedSlotsRes, occupiedSlots, allSlots, withinScheduleSlots, availableSlots;

  return regeneratorRuntime.async(function getRoomTrainerAvailability$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$query = req.query, roomId = _req$query.roomId, trainerId = _req$query.trainerId, day = _req$query.day;
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(pool.query("SELECT start_time, end_time FROM Schedule\n       WHERE trainer_id = $1 AND day = $2;", [trainerId, day]));

        case 4:
          scheduleRes = _context.sent;
          trainerSchedule = scheduleRes.rows[0]; // Assuming one schedule per trainer per day
          // Fetch occupied slots from the database

          _context.next = 8;
          return regeneratorRuntime.awrap(pool.query("SELECT start_time, end_time FROM Classes\n       WHERE (room_id = $1 OR trainer_id = $2) AND day = $3\n       ORDER BY start_time;", [roomId, trainerId, day]));

        case 8:
          occupiedSlotsRes = _context.sent;
          occupiedSlots = occupiedSlotsRes.rows; // Generate all possible detailed time slots for a day

          allSlots = generateDetailedTimeSlots(); // First filter: Remove slots outside the trainer's working hours
          // Assuming trainerSchedule.start_time and trainerSchedule.end_time are available and formatted as 'HH:MM'

          withinScheduleSlots = allSlots.filter(function (slot) {
            // Normalize times to 'HH:MM' format for comparison
            var formatTime = function formatTime(time) {
              return time.slice(0, 5);
            }; // Cuts off seconds if present


            var slotStartTime = formatTime(slot.startTime);
            var slotEndTime = formatTime(slot.endTime === '00:00' ? '24:00' : slot.endTime);
            var scheduleStartTime = formatTime(trainerSchedule.start_time);
            var scheduleEndTime = formatTime(trainerSchedule.end_time === '00:00' ? '24:00' : trainerSchedule.end_time); // Compare times in 'HH:MM' format

            return slotStartTime >= scheduleStartTime && slotEndTime <= scheduleEndTime;
          }); // Second filter: Remove slots that overlap with occupied slots

          availableSlots = withinScheduleSlots.filter(function (slot) {
            return !occupiedSlots.some(function (occupied) {
              var slotStart = slot.startTime;
              var slotEnd = slot.endTime;
              var occupiedStart = occupied.start_time;
              var occupiedEnd = occupied.end_time; // Slot starts before occupied ends and slot ends after occupied starts (overlap condition)

              return slotStart < occupiedEnd && slotEnd > occupiedStart;
            });
          });
          console.log('Available slots:', availableSlots);
          res.json({
            availableSlots: availableSlots
          });
          _context.next = 21;
          break;

        case 17:
          _context.prev = 17;
          _context.t0 = _context["catch"](1);
          console.error('Failed to fetch availability:', _context.t0);
          res.status(500).send('Error fetching availability');

        case 21:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 17]]);
};

var checkAvailability = function checkAvailability(req, res) {
  var _req$body, roomId, trainerId, day, startTime, endTime, scheduleRes, trainerSchedule, occupiedSlotsRes, occupiedSlots, startTimeDate, endTimeDate, trainerStartTime, trainerEndTime, isWithinWorkingHours, isSlotAvailable;

  return regeneratorRuntime.async(function checkAvailability$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body = req.body, roomId = _req$body.roomId, trainerId = _req$body.trainerId, day = _req$body.day, startTime = _req$body.startTime, endTime = _req$body.endTime;
          console.log("triggered!");
          console.log("day is" + day);
          _context2.prev = 3;
          console.log("check 1"); // Fetch trainer's schedule for the specified day

          _context2.next = 7;
          return regeneratorRuntime.awrap(pool.query("SELECT start_time, end_time FROM Schedule WHERE trainer_id = $1 AND day = $2;", [trainerId, day]));

        case 7:
          scheduleRes = _context2.sent;
          console.log("check 2"); // If the trainer does not have a schedule for the day, the slot is not available

          if (!(scheduleRes.rows.length === 0)) {
            _context2.next = 11;
            break;
          }

          return _context2.abrupt("return", res.status(200).json({
            isAvailable: false
          }));

        case 11:
          trainerSchedule = scheduleRes.rows[0];
          console.log("check 3"); // Fetch all classes that either use the room or the trainer for the specified day

          _context2.next = 15;
          return regeneratorRuntime.awrap(pool.query("SELECT start_time, end_time FROM Classes\n       WHERE (room_id = $1 OR trainer_id = $2) AND day = $3;", [roomId, trainerId, day]));

        case 15:
          occupiedSlotsRes = _context2.sent;
          console.log("check 4");
          occupiedSlots = occupiedSlotsRes.rows;
          console.log("check 5"); // Check if requested slot is within the trainer's working hours

          startTimeDate = parseTime(startTime);
          endTimeDate = parseTime(endTime);
          trainerStartTime = parseTime(trainerSchedule.start_time);
          trainerEndTime = parseTime(trainerSchedule.end_time);
          console.log("start time is" + startTimeDate);
          console.log("end time is" + endTimeDate);
          console.log("Trainer start time is" + trainerStartTime);
          console.log("Trainer end time is" + trainerEndTime);
          isWithinWorkingHours = startTimeDate >= trainerStartTime && endTimeDate <= trainerEndTime;

          if (isWithinWorkingHours) {
            _context2.next = 30;
            break;
          }

          return _context2.abrupt("return", res.status(200).json({
            isAvailable: false
          }));

        case 30:
          console.log("check 6");
          console.log('Occupied slots:', occupiedSlots); // Check if requested slot overlaps with any occupied slots

          isSlotAvailable = !occupiedSlots.some(function (occupied) {
            console.log("occupied start is" + occupied.start_time);
            console.log("occupied end is" + occupied.end_time);
            console.log("start time is" + startTime);
            console.log("end time is" + endTime);
            return startTime < occupied.end_time && endTime > occupied.start_time;
          }); // Respond with the availability of the slot

          res.status(200).json({
            isAvailable: isSlotAvailable
          });
          _context2.next = 40;
          break;

        case 36:
          _context2.prev = 36;
          _context2.t0 = _context2["catch"](3);
          console.error('Failed to check availability:', _context2.t0);
          res.status(500).send('Error checking availability');

        case 40:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[3, 36]]);
};

module.exports = {
  getRoomTrainerAvailability: getRoomTrainerAvailability,
  checkAvailability: checkAvailability
};