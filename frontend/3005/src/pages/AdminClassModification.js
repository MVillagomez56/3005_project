import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, FormControl, InputLabel, Select, MenuItem, FormGroup, FormControlLabel, Checkbox } from '@mui/material';

export const AdminClassModification = () => {
  const [className, setClassName] = useState('');
  const [description, setDescription] = useState('');
  const [trainerId, setTrainerId] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [day, setDay] = useState('');
  const [cost, setCost] = useState('');
  const [capacity, setCapacity] = useState('');
  const [classType, setClassType] = useState('');
  const [roomId, setRoomId] = useState('');
  const [approvalStatus, setApprovalStatus] = useState(false);

  // Ideally, you would fetch these lists from the server
  const trainersList = []; // Populate with trainers fetched from server
  const roomsList = []; // Populate with rooms fetched from server

  const handleSubmit = () => {
    // Submit the form data to the server
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" sx={{ mb: 4 }}>
        Class Modification
      </Typography>
      <FormGroup>
        <TextField label="Class Name" value={className} onChange={(e) => setClassName(e.target.value)} margin="normal" />
        <TextField label="Description" multiline rows={4} value={description} onChange={(e) => setDescription(e.target.value)} margin="normal" />
        <FormControl fullWidth margin="normal">
          <InputLabel>Trainer</InputLabel>
          <Select value={trainerId} label="Trainer" onChange={(e) => setTrainerId(e.target.value)}>
            {trainersList.map((trainer) => (
              <MenuItem key={trainer.id} value={trainer.id}>
                {trainer.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField label="Start Time" type="time" InputLabelProps={{ shrink: true }} value={startTime} onChange={(e) => setStartTime(e.target.value)} margin="normal" />
        <TextField label="End Time" type="time" InputLabelProps={{ shrink: true }} value={endTime} onChange={(e) => setEndTime(e.target.value)} margin="normal" />
        <TextField label="Day" type="number" value={day} onChange={(e) => setDay(e.target.value)} margin="normal" />
        <TextField label="Cost" type="number" value={cost} onChange={(e) => setCost(e.target.value)} margin="normal" />
        <TextField label="Capacity" type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} margin="normal" />
        <FormControl fullWidth margin="normal">
          <InputLabel>Class Type</InputLabel>
          <Select value={classType} label="Class Type" onChange={(e) => setClassType(e.target.value)}>
            <MenuItem value="personal">Personal</MenuItem>
            <MenuItem value="group">Group</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Room</InputLabel>
          <Select value={roomId} label="Room" onChange={(e) => setRoomId(e.target.value)}>
            {roomsList.map((room) => (
              <MenuItem key={room.id} value={room.id}>
                {room.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControlLabel control={<Checkbox checked={approvalStatus} onChange={(e) => setApprovalStatus(e.target.checked)} />} label="Approval Status" margin="normal" />
        <Button variant="contained" onClick={handleSubmit} sx={{ mt: 3 }}>
          Submit
        </Button>
      </FormGroup>
    </Container>
  );
};
