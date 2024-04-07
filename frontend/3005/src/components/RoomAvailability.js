import React from "react";
import {
  List,
  ListItemButton,
  ListItemText,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import {
  transformUnavailableIntoTimeSlots,
  dayOfWeek,
} from "../utils/time_converter";

export const RoomAvailability = ({ roomId }) => {
  const [timeSlots, setTimeSlots] = React.useState([]);
  const [newSelectedTimes, setNewSelectedTimes] = React.useState([]);
  const [day, setDay] = React.useState("");

  const handleSelectSlot = (dayIndex, slotIndex) => {
    //check if new slot is not contiguous with existing slots
    if (newSelectedTimes.length > 0) {
      for (let i = 0; i < newSelectedTimes.length; i++) {
        const [day, slot] = newSelectedTimes[i].split("-");
        if (day === dayIndex) {
          if (
            parseInt(slot) === slotIndex - 1 ||
            parseInt(slot) === slotIndex + 1 ||
            parseInt(slot) === slotIndex
          ) {
            break;
          } else {
            return;
          }
        } else {
          return;
        }
      }
    }

    const newSelected = `${dayIndex}-${slotIndex}`;

    if (newSelectedTimes.includes(newSelected)) {
      setNewSelectedTimes((prev) =>
        prev.filter((selected) => selected !== newSelected)
      );
    } else {
      setNewSelectedTimes((prev) => [...prev, newSelected]);
    }
  };

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
  }, [roomId]); // Added roomId as a dependency

  return (
    <div>
      <h1>Room Availability</h1>
      <FormControl fullWidth>
        <InputLabel id="day-select-label">Day</InputLabel>
        <Select
          labelId="day-select-label"
          id="day-select"
          value={day}
          label="Day"
          onChange={(e) => setDay(e.target.value)}
        >
          {Object.keys(dayOfWeek).map((day, index) => (
            <MenuItem key={index} value={day}>
              {dayOfWeek[day]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {day !== "" && timeSlots.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <ListItemText primary={dayOfWeek[day]} />
          <List sx={{ height: "15rem", overflowY: "scroll" }}>
            {timeSlots[day].slots.map((slot, slotIndex) => (
              <ListItemButton
                sx={{ height: "2rem" }} // Adjusted height for better UI
                key={slotIndex}
                onClick={() => handleSelectSlot(day, slotIndex)}
                selected={newSelectedTimes.includes(`${day}-${slotIndex}`)}
              >
                <ListItemText primary={`${slot[0]} - ${slot[1]}`} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      )}
    </div>
  );
};
