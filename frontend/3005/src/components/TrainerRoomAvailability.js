import React, { useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import { dayOfWeek } from '../utils/time_converter';

export const TrainerRoomAvailability = ({ roomId, trainerId }) => {
  const [combinedAvailability, setCombinedAvailability] = useState([]);
  const [selectedDay, setSelectedDay] = useState('');
  const [trainerWorkingDays, setTrainerWorkingDays] = useState([]);

const fetchTrainerWorkingDays = async () => {
    if (!trainerId) return;

    try {
        const response = await fetch(`http://localhost:5000/api/trainers/getTrainerSchedule/${trainerId}`);
        const data = await response.json();

        // Assuming `data` is the array of objects directly
        if (data && data.length > 0) {
            const workingDays = data.map(schedule => ({
                dayNumber: schedule.day,
                dayName: dayOfWeek[schedule.day], // Ensure dayOfWeek is correctly mapping day numbers to names
            }));
            setTrainerWorkingDays(workingDays);
        } else {
            setTrainerWorkingDays([]);
        }
    } catch (error) {
        console.error('Error fetching trainer schedule:', error);
        setTrainerWorkingDays([]);
    }
};

  const fetchCombinedAvailability = async () => {
    if (!roomId || !trainerId || !selectedDay) return;

    try {
      const queryParams = new URLSearchParams({ roomId, trainerId, day: selectedDay }).toString();
      const response = await fetch(`http://localhost:5000/api/availability/roomTrainerAvailability?${queryParams}`);
      const data = await response.json();

      if (data && data.availableSlots) {
        setCombinedAvailability(data.availableSlots);
      } else {
        setCombinedAvailability([]);
      }
    } catch (error) {
      console.error('Error fetching combined availability:', error);
      setCombinedAvailability([]);
    }
  };

  const selectDay = (e) => {
    const newSelectedDay = e.target.value;
    setSelectedDay(newSelectedDay);
  };

  useEffect(() => {
    fetchTrainerWorkingDays();
    console.log(trainerWorkingDays);
  }, [roomId, trainerId]); // Fetch working days when roomId or trainerId changes

  useEffect(() => {
    if (selectedDay) {
      fetchCombinedAvailability();
    }
  }, [selectedDay]); // Fetch availability when selectedDay changes

  return (
    <Box>
      <h1>Room and Trainer Combined Availability</h1>
      <FormControl fullWidth>
        <InputLabel id="day-select-label">Day</InputLabel>
        <Select
          labelId="day-select-label"
          id="day-select"
          value={selectedDay}
          label="Day"
          onChange={selectDay}
        >
          {trainerWorkingDays.map(({ dayNumber, dayName }, index) => (
            <MenuItem key={index} value={dayNumber}>
              {dayName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <List sx={{ mt: 2, maxHeight: '15rem', overflowY: 'auto' }}>
        {combinedAvailability.length > 0 &&
          combinedAvailability.map((slot, index) => (
            <ListItemButton key={index}>
              <ListItemText primary={`${slot.startTime} - ${slot.endTime}`} />
            </ListItemButton>
          ))}
      </List>
    </Box>
  );
};
