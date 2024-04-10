import React, { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom';
import { Container, TextField, Button, Typography, FormControl, InputLabel, Select, MenuItem, FormGroup } from '@mui/material';
import {TrainerRoomAvailability} from '../components/TrainerRoomAvailability';

export const CreateClass = () => {
  const navigate = useNavigate();
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
    type: '',
    roomId: '',
    approvalStatus: false,
  });

  const fetchTrainer = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/trainers/getValidTrainers'); // Replace with your backend API endpoint for fetching trainers
      const data = await response.json();
      setTrainersList(data.data.trainers);
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

  
  const handleSearchAvailability = () => { 
    setShowAvailability(true);
  }
  const checkSlotAvailability = async () => {
    console.log("Checking slot availability" + classDetails.day);
    console.log("Checking slot availability" + classDetails.startTime);
    console.log("Checking slot availability" + classDetails.endTime);
  const url = `http://localhost:5000/api/availability/checkAvailability`; // This should be the URL to your new endpoint
  const params = {
    roomId: classDetails.roomId,
    trainerId: classDetails.trainerId,
    day: classDetails.day,
    startTime: classDetails.startTime,
    endTime: classDetails.endTime,
  };
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    const data = await response.json();
    return data.isAvailable; // Assuming the endpoint returns { isAvailable: true/false }
  } catch (error) {
    console.error('Error checking slot availability:', error);
    return false; // Assume not available if there's an error
  }
  };
  

  
  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;
    setClassDetails((prevDetails) => ({
      ...prevDetails,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  

const handleSubmit = async (event) => {
  event.preventDefault();
  
  //   // Convert to integers as needed
  // const dayInt = parseInt(classDetails.day);
  // const costInt = parseInt(classDetails.cost);
  // const capacityInt = parseInt(classDetails.capacity);

  const payload = {
    ...classDetails,
    trainerId: Number(classDetails.trainerId),
    day: Number(classDetails.day),
    cost: Number(classDetails.cost),
    startTime: `${classDetails.startTime}:00`,
    endTime: `${classDetails.endTime}:00`,
    capacity: Number(classDetails.capacity),
    classType: "group", // Ensure this matches your DB and API expectation
    roomId: Number(classDetails.roomId),
  };

  // Remove any fields not expected by the backend, for example:
  delete payload.type; // If your backend expects classType instead of type
  delete payload.approvalStatus; // If this is set by the backend automatically

  // Step 1: Check Slot Availability
  const isAvailable = await checkSlotAvailability();
  if (!isAvailable) {
    alert('The selected slot is not available. Please choose another time.');
    return; // Early return if the selected slot is not available
  }

  // Step 2: Proceed with Class Submission if the Slot is Available
  try {
    const submitUrl = 'http://localhost:5000/api/classes/addClass'; // Adjust this URL to your endpoint for class creation
    const response = await fetch(submitUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      throw new Error(`Network response was not ok: ${errorDetails.error}`);
    }

    const result = await response.json();
    console.log('Class submitted successfully:', result);
    alert('Class created successfully!');

    // Optionally, reset the form or redirect the user
    // setClassDetails({ ...initialFormState }); // Reset form
    // navigate('/successPage'); // Redirect if using React Router
    navigate("/"); // Redirect to home page (change this to your desired URL

  } catch (error) {
    console.error('Error submitting class:', error);
    alert('There was an error creating the class. Please try again.');
  }
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
              {trainersList && trainersList.map((trainer) => (
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

          <Button type="submit" variant="contained" sx={{ mt: 3 }} onSubmit={handleSubmit}>Create</Button>
        </FormGroup>
      </form>
    </Container>
  );
};
