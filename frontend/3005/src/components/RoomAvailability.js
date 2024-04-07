import React from "react";
import { transformUnavailableIntoTimeSlots } from "../utils/time_converter";
export const RoomAvailability = ({ roomId }) => {
  const [timeSlots, setTimeSlots] = React.useState([]); // {day: [ [slot1_start, slot1_end], [slot2_start, slot2_end], ... ]}
  console.log(roomId);

  const fetchTimeSlots = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/rooms/getRoomSchedule/${roomId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      const data = await response.json();

      const slots = transformUnavailableIntoTimeSlots(data, 0, 24);

      setTimeSlots(slots);
    } catch (error) {
      console.error("Error fetching time slots: ", error);
    }
  };


  React.useEffect(() => {
    fetchTimeSlots();
  }, []);

  return (
    <div>
      <h1>Room Availability</h1>
      <ul>
        {timeSlots &&
          timeSlots.map((day) => (
            <li key={day.day}>
              <h2>Day {day.day}</h2>
              <ul>
                {day.slots.map((slot, index) => (
                  <li key={index}>
                    {slot[0]} - {slot[1]}
                  </li>
                ))}
              </ul>
            </li>
          ))}
      </ul>
    </div>
  );
};
