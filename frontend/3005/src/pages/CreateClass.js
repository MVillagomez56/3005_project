import React, { useEffect, useState } from 'react';
import { Container, TextField, Button, Typography, FormControl, InputLabel, Select, MenuItem, FormGroup } from '@mui/material';
import {TrainerRoomAvailability} from '../components/TrainerRoomAvailability';

export const CreateClass = () => {
  const [showAvailability, setShowAvailability] = useState(false);
  const [trainersList, setTrainersList] = useState([]); // This should come from your backend
  const [roomsList, setRoomsList] = useState([]); // This should come from your backend
  const [classDetails, setClassDetails] = useState({
    name: '',
    description: '',
    trainerId: '',
    startTime: '',
    endTime: '',
    day: '',
    cost: '',
    capacity: '',
    classType: '',
    roomId: '',
    approvalStatus: false,
  });

  const fetchTrainer = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/trainers/getValidTrainers'); // Replace with your backend API endpoint for fetching trainers
      const data = await response.json();
      setTrainersList(data);
    } catch (error) {
      console.error('Error fetching trainers:', error);
    }
  };

  const fetchRooms = async () => {
    try { 
      const response = await fetch('http://localhost:5000/api/rooms/getRooms'); // Replace with your backend API endpoint for fetching rooms
      const data = await response.json();
      setRoomsList(data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  useEffect(() => {
    fetchTrainer();
    fetchRooms();
  }, []);

  
  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;
    setClassDetails((prevDetails) => ({
      ...prevDetails,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(classDetails);
    // Here you would send the classDetails to your backend
  };

  const handleSearchAvailability = () => {
    // Trigger showing the availability component
    setShowAvailability(true);
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" sx={{ mb: 4 }}>Create Class</Typography>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <TextField name="name" label="Class Name" value={classDetails.name} onChange={handleChange} margin="normal" required />
          <TextField name="description" label="Description" multiline rows={4} value={classDetails.description} onChange={handleChange} margin="normal" required />
          <FormControl fullWidth margin="normal">
            <InputLabel>Trainer</InputLabel>
            <Select name="trainerId" value={classDetails.trainerId} label="Trainer" onChange={handleChange} required>
              {Array.isArray(trainersList) && trainersList.map((trainer) => (
                <MenuItem key={trainer.id} value={trainer.id}>{trainer.name}</MenuItem>
              ))}
            </Select>


          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Room</InputLabel>
            
            <Select name="roomId" value={classDetails.roomId} label="Room" onChange={handleChange} required>
                {Array.isArray(roomsList) && roomsList.map((room) => (
                    <MenuItem key={room.id} value={room.id}>{room.name}</MenuItem>
                ))}
            </Select>
          

          </FormControl>
          {/* Search availability button */}
          <Button onClick={handleSearchAvailability} variant="outlined" sx={{ mt: 3, mb: 3 }}>
            Check Trainer and Room Availability
          </Button>
          
          {/* Conditional rendering of the TrainerRoomAvailability component based on search action */}
          {showAvailability && (
            <TrainerRoomAvailability
              trainerId={classDetails.trainerId}
              roomId={classDetails.roomId}
              // Additional props if needed
            />
          )}
          <TextField name="startTime" label="Start Time" type="time" value={classDetails.startTime} onChange={handleChange} margin="normal" InputLabelProps={{ shrink: true }} required />
          <TextField name="endTime" label="End Time" type="time" value={classDetails.endTime} onChange={handleChange} margin="normal" InputLabelProps={{ shrink: true }} required />
          <TextField name="day" label="Day (1-7 for Mon-Sun)" type="number" value={classDetails.day} onChange={handleChange} margin="normal" required />
          <TextField name="cost" label="Cost" type="number" value={classDetails.cost} onChange={handleChange} margin="normal" required />
          <TextField name="capacity" label="Capacity" type="number" value={classDetails.capacity} onChange={handleChange} margin="normal" required />
          <FormControl fullWidth margin="normal">
            <InputLabel>Type</InputLabel>
            <Select name="classType" value={classDetails.classType} label="Type" onChange={handleChange} required>
              <MenuItem value="personal">Personal</MenuItem>
              <MenuItem value="group">Group</MenuItem>
            </Select>
          </FormControl>

          <Button type="submit" variant="contained" sx={{ mt: 3 }}>Create</Button>
        </FormGroup>
      </form>
    </Container>
  );
};
