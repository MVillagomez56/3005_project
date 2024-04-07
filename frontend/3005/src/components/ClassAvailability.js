import React, { useEffect } from "react";
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
import { dayOfWeek } from "../utils/time_converter";

export const ClassAvailability = ({ classId, setNewTime }) => {
  const [timeSlots, setTimeSlots] = React.useState([]);
  const [newSelectedTimes, setNewSelectedTimes] = React.useState([]);
  const [day, setDay] = React.useState("");

  const handleSelectSlot = (dayIndex, slotIndex) => {
    //check if new slot is not contiguous with existing slots
    console.log("Selected: ", dayIndex, slotIndex);
    if (newSelectedTimes.length > 0) {
      console.log("Checking for contiguous slots");
      for (let i = 0; i < newSelectedTimes.length; i++) {
        const [day, slot] = newSelectedTimes[i].split("-");
        console.log(day, slot);
        if (parseInt(day) === dayIndex) {
          if (
            parseInt(slot) === slotIndex - 1 ||
            parseInt(slot) === slotIndex + 1 ||
            parseInt(slot) === slotIndex
          ) {
            break;
          } else {
            if (i === newSelectedTimes.length - 1) {
              console.log("Not contiguous");
              return;
            }
            continue;
          }
        } else {
          console.log("Different day");
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

  useEffect(() => {
    const minAndMax = () => {
      const selectedSlots = newSelectedTimes.map((slot) => {
        const [day, slotIndex] = slot.split("-");
        return parseInt(slotIndex);
      });
      console.log("Selected Slots: ", selectedSlots);
      //return min and max and day
      return [Math.min(...selectedSlots), Math.max(...selectedSlots) + 1] 
    };

    setNewTime((prev) => {
      return {
        ...prev,
        day: parseInt(day),
        start_time: minAndMax()[0],
        end_time: minAndMax()[1],
      };
    });
  }, [newSelectedTimes]);

  console.log("New Selected: ", newSelectedTimes);

  const fetchTimeSlots = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/classes/getClassAvailableTimeSlots/${classId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      const data = await response.json();
      //split time slots into hourly slots
      const slots = splitIntoHourlySlots(data);
      console.log("Slots: ", slots);
      setTimeSlots(slots);
    } catch (error) {
      console.error("Error fetching time slots: ", error);
    }
  };

  const splitIntoHourlySlots = (timeSlots) => {
    return timeSlots.map((daySlot) => {
      const newTimeSlots = daySlot.timeSlots.flatMap((slot) => {
        const chunks = [];
        //if a time does not match the format HH:MM:SS, make sure to convert it to that format
        if (slot.start.split(":")[0].length === 1) {
          slot.start = `0${slot.start}`;
        }
        if (slot.end.split(":")[0].length === 1) {
          slot.end = `0${slot.end}`;
        }

        let startTime = new Date(`1970-01-01T${slot.start}`);
        const endTime = new Date(`1970-01-01T${slot.end}`);

        while (startTime < endTime) {
          const endChunkTime = new Date(startTime.getTime() + 60 * 60000); // Add 60 minutes
          chunks.push({
            start: startTime.toTimeString().substring(0, 5),
            end:
              endChunkTime > endTime
                ? endTime.toTimeString().substring(0, 5)
                : endChunkTime.toTimeString().substring(0, 5),
          });
          startTime = endChunkTime;
        }
        return chunks;
      });

      return { ...daySlot, timeSlots: newTimeSlots };
    });
  };

  React.useEffect(() => {
    fetchTimeSlots();
  }, []); // Added roomId as a dependency

  return (
    <div>
      <h1>Class Availability</h1>
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
            <MenuItem key={index} value={day} disabled={timeSlots[day]?.timeSlots.length === 0}>
              {dayOfWeek[day]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {day !== "" && timeSlots.length > 0 ? (
        <Box sx={{ mt: 2 }}>
          <ListItemText primary={dayOfWeek[day]} />
          <List sx={{ height: "15rem", overflowY: "scroll" }}>
            {timeSlots[parseInt(day)]?.timeSlots.length > 0 &&
              timeSlots[parseInt(day)]?.timeSlots.map((slot) => (
                <ListItemButton
                  sx={{ height: "2rem" }}
                  key={slot.start}
                  onClick={() =>
                    handleSelectSlot(parseInt(day), parseInt(slot.start))
                  }
                  selected={newSelectedTimes.includes(
                    `${parseInt(day)}-${parseInt(slot.start)}`
                  )}
                >
                  <ListItemText primary={`${slot.start} - ${slot.end}`} />
                </ListItemButton>
              ))}
            {timeSlots[parseInt(day)]?.timeSlots.length === 0 && (
              <p>No available time slots</p>
            )}
          </List>
        </Box>
      ) : (
        <p>Not available</p>
      )}
    </div>
  );
};
