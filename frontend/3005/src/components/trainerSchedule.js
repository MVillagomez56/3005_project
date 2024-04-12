import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Paper, Grid, Box
} from '@mui/material';

export const TrainerSchedule = () => {
  const [workingHours, setWorkingHours] = useState({});
  const currentUser = JSON.parse(localStorage.getItem("user"));
    
    useEffect(() => {
      fetchWorkingHours();
    }, []);
  
    const fetchWorkingHours = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/trainers/${currentUser.id}/working-hours`);
        if (!response.ok) throw new Error('Failed to fetch working hours.');
        const data = await response.json();
        const formattedHours = data.reduce((acc, curr) => {
          acc[curr.day] = { start: curr.start_time, end: curr.end_time };
          return acc;
        }, {});
        setWorkingHours(formattedHours);
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
    
    
  const daysMap = {1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday', 5: 'Friday', 6: 'Saturday', 0: 'Sunday'};

  return (
    <Container maxWidth="md" sx={{ pt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Trainer Schedule
      </Typography>

      {/* Enhanced Display for Working Hours with Cards */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h6" gutterBottom>
          Working Hours
        </Typography>
        <Grid container spacing={3}>
          {Object.entries(workingHours).sort((a, b) => a[0] - b[0]).map(([day, hours]) => (
            <Grid item xs={12} sm={6} md={4} key={day}>
              <Paper elevation={3} sx={{ padding: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Typography variant="h6">{daysMap[day]}: {hours.start} - {hours.end}</Typography>
                
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
      
    </Container>
  );
};