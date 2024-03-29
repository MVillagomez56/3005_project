import React, { useEffect, useState } from 'react';
import { Container, Grid, Paper, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import trainerProfilePic from '../assets/trainer_profile.png';


export const TrainersPage = () => {
  const navigate = useNavigate();
  const [trainers, setTrainers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/trainers`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTrainers(data); // Assuming the API returns an array of trainers
        } else {
          throw new Error('Failed to fetch trainers');
        }
      } catch (error) {
        console.error('Error fetching trainers:', error);
        setError(error.message);
      }
    };

    fetchTrainers();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ marginTop: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        Trainers
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <Grid container spacing={4}>
        {trainers.map((trainer) => (
          <Grid item xs={12} sm={6} md={4} key={trainer.id}>
            <Paper elevation={3} sx={{ padding: '1rem', textAlign: 'center' }}>
              <img src={trainerProfilePic} alt="Trainer" style={{ width: '100px', height: '100px' }} />
              <Typography variant="h6">{trainer.name}</Typography>
              <Typography>{trainer.specialization}</Typography>
              <Button
                variant="contained"
                sx={{ margin: '1rem' }}
                onClick={() => navigate(`/trainer/${trainer.id}`)}
              >
                Check Detail
              </Button>
              {/* Additional information such as the trainer's session name and available slots */}
              {/* would be rendered here if included in the trainer data. */}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

