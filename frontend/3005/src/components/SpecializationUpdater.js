import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';

export const SpecializationUpdater = ({ trainerId, onUpdate }) => {
  const [specialization, setSpecialization] = useState('');
  const [cost, setCost] = useState('');

  const handleUpdate = async () => {
    onUpdate(specialization, cost);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6">Update Specialization and Cost</Typography>
      <TextField
        label="Specialization"
        value={specialization}
        onChange={(e) => setSpecialization(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Cost"
        type="number"
        value={cost}
        onChange={(e) => setCost(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button onClick={handleUpdate} variant="contained" sx={{ mt: 2 }}>
        Update
      </Button>
    </Box>
  );
};
