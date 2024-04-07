function findOverlap(
  roomAvailability,
  trainerAvailability,
  availableTimeSlots
) {
  for (let i = 0; i < 7; i++) {
    const roomSlots = roomAvailability[i].timeSlots;
    const trainerSlots = trainerAvailability[i].timeSlots;

    const availableSlots = [];

    for (let j = 0; j < roomSlots.length; j++) {
      const roomSlot = roomSlots[j];
      for (let k = 0; k < trainerSlots.length; k++) {
        const trainerSlot = trainerSlots[k];
        console.log("roomSlot", roomSlot, "trainerSlot", trainerSlot);
        const start = Math.max(
          parseInt(roomSlot.start.slice(0, 2)),
          parseInt(trainerSlot.start.slice(0, 2))
        );
        const end = Math.min(
          parseInt(roomSlot.end.slice(0, 2)),
          parseInt(trainerSlot.end.slice(0, 2))
        );

        if (start < end) {
          availableSlots.push({
            start: `${start}:00:00`,
            end: `${end}:00:00`,
          });
        }
      }
    }

    availableTimeSlots.push({
      day: i,
      timeSlots: availableSlots,
    });
  }
}
function calculateTrainerAvailability(scheduleTime, classTime) {
  const availableTimeSlots = [];

  for (let i = 0; i < 7; i++) {
    const schedule = scheduleTime.find((schedule) => schedule.day === i);
    const classes = classTime.filter((classTime) => classTime.day === i);

    if (!schedule) {
      availableTimeSlots.push({
        day: i,
        timeSlots: [],
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
  return availableTimeSlots;
}

function calculateRoomAvailability(rows) {
  const availableTimeSlots = [];

  for (let i = 0; i < 7; i++) {
    const classes = rows.filter((classTime) => classTime.day === i);
    availableTimeSlots.push({
      day: i,
      timeSlots: [],
    });

    let start = "00:00:00";
    let end = "24:00:00";

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
  return availableTimeSlots;
}

module.exports = {
  findOverlap,
  calculateTrainerAvailability,
  calculateRoomAvailability,
};
