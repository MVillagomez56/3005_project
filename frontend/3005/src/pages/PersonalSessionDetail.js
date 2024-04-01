import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Button, Paper, TextField, FormControlLabel, Checkbox } from '@mui/material';

export const PersonalSessionDetail = () => {
  const { id } = useParams();
  const [trainer, setTrainer] = useState(null);
  const [error, setError] = useState(null);
  const [selectedSlots, setSelectedSlots] = useState({});
  const [duration, setDuration] = useState('');

  // Helper function to format the availability times
  const formatAvailability = (timeRange) => {
    if (!timeRange) return 'Unavailable';
    const times = timeRange.replace(/\[|\)|"/g, '').split(',');
    const startTime = times[0].trim();
    const endTime = times[1].trim();
    return `${startTime.slice(0, -3)} - ${endTime.slice(0, -3)}`;
  };

  // Function to handle slot checkbox changes
  const handleSlotChange = (event) => {
    const { name, checked } = event.target;
    setSelectedSlots(prev => ({ ...prev, [name]: checked }));
  };

  const isSlotSelected = () => {
    return Object.values(selectedSlots).some(value => value);
  };

  useEffect(() => {
    const fetchTrainerDetail = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/trainer/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTrainer(data); // Assuming the API returns the details for a single trainer
        } else {
          throw new Error('Failed to fetch trainer details');
        }
      } catch (error) {
        console.error('Error fetching trainer details:', error);
        setError(error.message);
      }
    };

    fetchTrainerDetail();
  }, [id]);

  const handleDurationChange = (event) => {
    setDuration(event.target.value);
  };

  const handleRegister = async () => {
    // Calculate the amount based on the duration and trainer's rate
    const amount = Number(duration) * trainer.cost; // Adjust according to your rate logic
  
    // Extract the names of the days that were selected
    const selectedSlotNames = Object.entries(selectedSlots)
      .filter(([day, isSelected]) => isSelected)
      .map(([day]) => day);
  
    try {
      const response = await fetch(`http://localhost:5000/api/payment/processing/personal_training/${amount}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          trainerId: id,
          duration: duration,
          selectedSlots: selectedSlotNames, // Send the array of selected day names
          amount: amount,
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Registration successful', data);
        // Navigate to another page or show success message
      } else {
        throw new Error('Failed to process payment');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      setError(error.message);
    }
  };
  

  return (
    <Container maxWidth="sm" sx={{ marginTop: '2rem' }}>
      <Paper elevation={3} sx={{ padding: '2rem', textAlign: 'center' }}>
        {error && <Typography color="error">{error}</Typography>}
        {trainer && (
          <>
            <Typography variant="h4" gutterBottom>
              {trainer.name}
            </Typography>
            <Typography variant="h5">
              ${trainer.cost} /hr
            </Typography>
            {Object.entries(trainer.availability).map(([day, timeRange]) => {
              if (timeRange) {
                return (
                  <div key={day}>
                    <Typography>
                      {`${day.charAt(0).toUpperCase() + day.slice(1)}: ${formatAvailability(timeRange)}`}
                    </Typography>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={!!selectedSlots[day]}
                          onChange={handleSlotChange}
                          name={day}
                        />
                      }
                      label="Select"
                    />
                  </div>
                );
              }
              return null;
            })}
            <TextField
              label="Duration (hours)"
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              value={duration}
              onChange={handleDurationChange}
              sx={{ marginY: 2 }}
            />
            <Button
              variant="contained"
              disabled={!isSlotSelected() || !duration}
              onClick={handleRegister}
              sx={{ marginY: 2 }}
            >
              Register
            </Button>
          </>
        )}
      </Paper>
    </Container>
  );
};
