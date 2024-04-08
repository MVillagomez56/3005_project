export const convertTime = (time) => {
  let hours = time.split(":")[0];
  let minutes = time.split(":")[1];
  let ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12;
  return hours + ":" + minutes + " " + ampm;
};

export const dayOfWeek = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

export function transformUnavailableIntoTimeSlots(unavailable, start, end) {
  const output = [];
  const formattedTimeSlots = formatTimeSlots(unavailable);

  for (const day in formattedTimeSlots) {
    const slots = formattedTimeSlots[day];
    const subtractedSlots = subtractTimeSlots(slots, start, end);
    const daySlots = { day: day, slots: subtractedSlots };
    output.push(daySlots);
  }

  console.log("out",output);
  return output;
}

function formatTimeSlots(aslots) {
  let timeSlots = {};
  //make it for all days
  for (let i = 0; i < 7; i++) {
    timeSlots[i] = [];
  }
  aslots.forEach((slot) => {
    timeSlots[slot.day].push([
      slot.start_time.slice(0, -3),
      slot.end_time.slice(0, -3),
    ]);
  });
  return timeSlots;
}

function subtractTimeSlots(slots, start, end) {
  const startOfDay = start * 60; // 9:00 AM in minutes
  const endOfDay = end * 60; // 8:00 PM in minutes
  let timeline = Array(endOfDay - startOfDay).fill(true); // true indicates availability

  slots.forEach((slot) => {
    let [start, end] = slot.map((time) => {
      let [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes - startOfDay;
    });

    for (let i = start; i < end; i++) {
      if (i >= 0 && i < timeline.length) timeline[i] = false; // Mark as unavailable
    }
  });

  // Aggregate continuous available slots
  let availableSlots = [];
  let slotStart = null;
  for (let i = 0; i < timeline.length; i++) {
    if (timeline[i] && slotStart === null) {
      slotStart = i;
    } else if (!timeline[i] && slotStart !== null) {
      availableSlots.push([
        `${Math.floor((slotStart + startOfDay) / 60)}:${(
          (slotStart + startOfDay) %
          60
        )
          .toString()
          .padStart(2, "0")}`,
        `${Math.floor((i + startOfDay) / 60)}:${((i + startOfDay) % 60)
          .toString()
          .padStart(2, "0")}`,
      ]);
      slotStart = null;
    }
  }
  // Handle case where the last slot goes until the end of the day
  if (slotStart !== null) {
    availableSlots.push([
      `${Math.floor((slotStart + startOfDay) / 60)}:${(
        (slotStart + startOfDay) %
        60
      )
        .toString()
        .padStart(2, "0")}`,
      `${Math.floor((timeline.length + startOfDay) / 60)}:${(
        (timeline.length + startOfDay) %
        60
      )
        .toString()
        .padStart(2, "0")}`,
    ]);
  }

  const splitSlots = splitIntoHourlySlots([{ timeSlots: availableSlots }]);
  return splitSlots;
}

//split the timeslots into 1 hour slots

export const splitIntoHourlySlots = (timeSlots) => {
  return timeSlots.map(daySlot => {
    const newTimeSlots = daySlot.timeSlots.flatMap(slot => {
      const chunks = [];
      let startTime = new Date(`1970-01-01T${slot.start}`);
      const endTime = new Date(`1970-01-01T${slot.end}`);

      while (startTime < endTime) {
        const endChunkTime = new Date(startTime.getTime() + 60 * 60000); // Add 60 minutes
        chunks.push({
          start: startTime.toTimeString().substring(0, 5),
          end: endChunkTime > endTime ? endTime.toTimeString().substring(0, 5) : endChunkTime.toTimeString().substring(0, 5),
        });
        startTime = endChunkTime;
      }
      return chunks;
    });

    return { ...daySlot, timeSlots: newTimeSlots };
  });
};
