import React, { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
} from "@mui/material";

export const TrainerScheduleSetter = ({ trainerId, onSave }) => {
  const [day, setDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchApprovedClasses = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/trainers/approvedClasses/${trainerId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch classes");
        }
        const data = await response.json();
        setClasses(data);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    fetchApprovedClasses();
  }, [trainerId]);

  const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const isScheduleValid = () => {
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);

    for (let classItem of classes) {
      const classStartMinutes = timeToMinutes(classItem.start_time);
      const classEndMinutes = timeToMinutes(classItem.end_time);

      if (startMinutes >= classStartMinutes && startMinutes < classEndMinutes) {
        alert("Schedule start time conflicts with an existing class.");
        return false;
      }

      if (endMinutes > classStartMinutes && endMinutes <= classEndMinutes) {
        alert("Schedule end time conflicts with an existing class.");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = () => {
    if (isScheduleValid()) {
      onSave(day, startTime, endTime);
    }
  };

  return (
    <Box>
      <FormControl fullWidth margin="normal">
        <InputLabel>Day</InputLabel>
        <Select value={day} onChange={(e) => setDay(e.target.value)}>
          {[
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ].map((day, index) => (
            <MenuItem key={index} value={index + 1}>
              {day}
            </MenuItem> // Assuming days are 1-indexed in your DB
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel>Start Time</InputLabel>
        <Select
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        >
          {[...Array(24).keys()].map((hour) => (
            <MenuItem key={hour} value={`${hour}:00`}>{`${hour}:00`}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel>End Time</InputLabel>
        <Select value={endTime} onChange={(e) => setEndTime(e.target.value)}>
          {[...Array(24).keys()].map((hour) => (
            <MenuItem key={hour} value={`${hour}:00`}>{`${hour}:00`}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button variant="contained" onClick={handleSubmit}>
        Save
      </Button>
    </Box>
  );
};
