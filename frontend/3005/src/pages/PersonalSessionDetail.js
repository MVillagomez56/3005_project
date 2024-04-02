import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Button, Paper, TextField, FormControlLabel, Checkbox, Box } from '@mui/material';

export const PersonalSessionDetail = () => {
  const { id } = useParams();
  const [trainer, setTrainer] = useState(null);
  const [error, setError] = useState(null);
  const [selectedSlots, setSelectedSlots] = useState({});
  const [startTimes, setStartTimes] = useState({});
  const [duration, setDuration] = useState('');

  const formatAvailability = (timeRange) => {
    if (!timeRange) return null; // Don't return 'Unavailable', return null to indicate no display
    const times = timeRange.replace(/\[|\)|"/g, '').split(',');
    return `${times[0].trim().slice(0, -3)} - ${times[1].trim().slice(0, -3)}`;
  };

  const handleSlotChange = (event) => {
    const { name, checked } = event.target;
    setSelectedSlots(prev => ({ ...prev, [name]: checked }));
    if (!checked) {
      setStartTimes(prev => {
        const newTimes = { ...prev };
        delete newTimes[name];
        return newTimes;
      });
    }
  };

  const handleStartTimeChange = (day) => (event) => {
    setStartTimes(prev => ({ ...prev, [day]: event.target.value }));
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
          setTrainer(data);
        } else {
          throw new Error('Failed to fetch trainer details');
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchTrainerDetail();
  }, [id]);

  const handleDurationChange = (event) => {
    setDuration(event.target.value);
  };

  const handleRegister = async () => {
    const amount = Number(duration) * trainer.cost;
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
          selectedSlots: selectedSlotNames,
          startTimes: startTimes,
          amount: amount,
        }),
      });

      if (response.ok) {
        console.log('Registration successful', await response.json());
      } else {
        throw new Error('Failed to process payment');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: '2rem' }}>
      <Paper elevation={3} sx={{ padding: '2rem', textAlign: 'center' }}>
        {error && <Typography color="error">{error}</Typography>}
        {trainer && (
          <>
            <Typography variant="h4" gutterBottom>{trainer.name}</Typography>
            <Typography variant="h5">${trainer.cost} /hr</Typography>
            {Object.entries(trainer.availability).map(([day, timeRange]) => {
              const availability = formatAvailability(timeRange);
              if (availability) { // Only display if availability is not null
                return (
                  <Box key={day} sx={{ marginBottom: 2 }}> {/* Add margin between days */}
                    <Typography>{`${day.charAt(0).toUpperCase() + day.slice(1)}: ${availability}`}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                      <FormControlLabel
                        control={<Checkbox checked={!!selectedSlots[day]} onChange={handleSlotChange} name={day} />}
                        label="Select"
                      />
                      {selectedSlots[day] && (
                        <Box sx={{ width: '100%', mt: 1 }}> {/* New line for start time */}
                          <TextField
                            fullWidth
                            label="Start Time"
                            type="time"
                            value={startTimes[day] || ''}
                            onChange={handleStartTimeChange(day)}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            inputProps={{
                              step: 300, // 5 min
                            }}
                          />
                        </Box>
                      )}
                    </Box>
                  </Box>
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
