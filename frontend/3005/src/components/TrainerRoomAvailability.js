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
  const [roomAvailability, setRoomAvailability] = useState([]);
  const [trainerAvailability, setTrainerAvailability] = useState([]);
  const [combinedAvailability, setCombinedAvailability] = useState([]);
  const [selectedDay, setSelectedDay] = useState('');

  useEffect(() => {
    const fetchAvailabilities = async () => {
      // Fetch Room Availability
      const roomResponse = await fetch(`your_api_endpoint/rooms/${roomId}/availability`);
      const roomData = await roomResponse.json();
      setRoomAvailability(roomData);

      // Fetch Trainer Availability
      const trainerResponse = await fetch(`your_api_endpoint/trainers/${trainerId}/availability`);
      const trainerData = await trainerResponse.json();
      setTrainerAvailability(trainerData);

      // Assuming your backend has an endpoint to get combined availability,
      // otherwise, you'll have to do the combination logic on the client side
      // using the provided `findOverlap` function logic.
      const combinedResponse = await fetch(`your_api_endpoint/combinedAvailability?roomId=${roomId}&trainerId=${trainerId}`);
      const combinedData = await combinedResponse.json();
      setCombinedAvailability(combinedData);
    };

    fetchAvailabilities();
  }, [roomId, trainerId]);

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
          onChange={(e) => setSelectedDay(e.target.value)}
        >
          {Object.keys(dayOfWeek).map((day, index) => (
            <MenuItem key={index} value={day}>
              {dayOfWeek[day]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <List sx={{ mt: 2, maxHeight: '15rem', overflowY: 'auto' }}>
        {combinedAvailability.length > 0 && selectedDay !== '' &&
          combinedAvailability[parseInt(selectedDay)]?.timeSlots.map((slot, index) => (
            <ListItemButton key={index}>
              <ListItemText primary={`${slot.start} - ${slot.end}`} />
            </ListItemButton>
          ))
        }
      </List>
    </Box>
  );
};
