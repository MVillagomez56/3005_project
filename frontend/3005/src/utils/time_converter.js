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
  return output;
}

function formatTimeSlots(aslots) {
  let timeSlots = {};
  aslots.forEach((slot) => {
    if (!timeSlots[slot.day]) {
      timeSlots[slot.day] = [];
    }
    //remove the last 3 characters from the string
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

  // Convert time slots to minutes and mark as unavailable
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

  const splitSlots = splitTimeSlots(availableSlots);
  return splitSlots;
}

//split the timeslots into 1 hour slots

const splitTimeSlots = (slots) => {
  let splitSlots = [];
  slots.forEach((slot) => {
    let [start, end] = slot;
    let [startHour, startMin] = start.split(":").map(Number);
    let [endHour, endMin] = end.split(":").map(Number);

    while (
      startHour < endHour ||
      (startHour === endHour && startMin < endMin)
    ) {
      let newEndHour = startHour + 1;
      let newEndMin = startMin;
      if (newEndHour === endHour && newEndMin > endMin) {
        newEndHour = endHour;
        newEndMin = endMin;
      }
      splitSlots.push([
        `${startHour}:${startMin.toString().padStart(2, "0")}`,
        `${newEndHour}:${newEndMin.toString().padStart(2, "0")}`,
      ]);
      startHour = newEndHour;
      startMin = newEndMin;
    }
  });
  return splitSlots;
};
