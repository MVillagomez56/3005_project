import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';

import { useNavigate } from 'react-router-dom';
export const Hero = () => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        pt: 8,
        pb: 6,
        bgcolor: 'primary.main',
        color: 'white',
      }}
    >
      <Container maxWidth="sm">
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="inherit"
          gutterBottom
        >
          This is a good muhamuha gym, the best gym in the world! Muha
        </Typography>
        <Typography variant="h5" align="center" color="inherit" paragraph>
          Get a quick overview of your activity or dive deeper into the details.
          Muha muha the greatest!

          Unfortunately, due to  technical difficulty and lack of funding,
          there is no refund provided for our service. No refund policy, Muha!
        </Typography>
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button variant="contained" sx={{ backgroundColor: 'white', color: '#1976d2', '&:hover': { backgroundColor: '#e3f2fd' } }}
            onClick={()=>navigate("/courses")}>
            Check out course
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

