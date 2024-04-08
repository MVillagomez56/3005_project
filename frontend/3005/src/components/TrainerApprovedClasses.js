import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

export const TrainerApprovedClasses = ({ trainerId }) => {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchApprovedClasses = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/trainers/approvedClasses/${trainerId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch classes');
        }
        const data = await response.json();
        setClasses(data);
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };
  
    if (trainerId) {
      fetchApprovedClasses();
    }
  }, []);
  

  if (classes.length === 0) {
    return <Typography>No approved classes found.</Typography>;
  }

  return (
    <Box>
      <Typography variant="h6">Approved Classes</Typography>
      {classes.map((classItem, index) => (
        <Box key={index} sx={{ marginBottom: 2 }}>
          <Typography variant="body1"><strong>Name:</strong> {classItem.name}</Typography>
          <Typography variant="body1"><strong>Description:</strong> {classItem.description}</Typography>
          <Typography variant="body1"><strong>Day:</strong> {classItem.day}</Typography>
          <Typography variant="body1"><strong>Start Time:</strong> {classItem.start_time}</Typography>
          <Typography variant="body1"><strong>End Time:</strong> {classItem.end_time}</Typography>
          <Typography variant="body1"><strong>Room ID:</strong> {classItem.room_id}</Typography>
        </Box>
      ))}
    </Box>
  );
};
