import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, TextField, MenuItem, Select, FormControl, InputLabel, Card, CardContent, Grid } from '@mui/material';

export const EquipmentStatus = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [equipment, setEquipment] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState({});
  const [newName, setNewName] = useState('');
  const [newStatus, setNewStatus] = useState('');

  // GET request to fetch equipment
  const fetchEquipment = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/equipment/getEquipment');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setEquipment(data);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  // POST request to modify equipment (for Admins)
  const sendEquipmentModification = async () => {
    console.log(selectedEquipment.id);
    try {
      const response = await fetch(`http://localhost:5000/api/equipment/changeEquipmentStatus/${selectedEquipment.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newStatus, newName }),
      });
      if (!response.ok) throw new Error('Failed to update');
      alert('Equipment updated successfully');
      fetchEquipment(); // Refetch to get the latest data
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  // When admin selects an equipment to edit, set the selected equipment and its current status
  const handleEditClick = (eq) => {
    setSelectedEquipment(eq);
    setNewName(eq.name);
    setNewStatus(eq.status); // Set default value for status
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>Equipment List</Typography>
      <Grid container spacing={2}>
        {equipment.map((eq) => (
          <Grid item xs={12} md={6} key={eq.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">Name: {eq.name}</Typography>
                <Typography>Description: {eq.description}</Typography>
                <Typography>Status: {eq.status}</Typography>
                {user.role === 'admin' && (
                  <Button variant="contained" color="primary" onClick={() => handleEditClick(eq)}>
                    Edit
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {user.role === 'admin' && selectedEquipment.id && (
        <Container maxWidth="sm" style={{ marginTop: '20px' }}>
          <Typography variant="h5" gutterBottom>Edit Equipment</Typography>
          <TextField
            fullWidth
            label="New Name"
            variant="outlined"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              label="Status"
            >
              <MenuItem value="available">Available</MenuItem>
              <MenuItem value="unavailable">Unavailable</MenuItem>
              <MenuItem value="maintenance">Maintenance</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" color="secondary" onClick={sendEquipmentModification} style={{ marginTop: '10px' }}>
            Submit
          </Button>
        </Container>
      )}
    </Container>
  );
};
