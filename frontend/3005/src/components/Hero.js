import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';

export const Hero = () => {
  return (
    <Box
      sx={{
        pt: 8,
        pb: 6,
        backgroundColor: '#FFD1DC', // Feel free to change the color
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
          This is a good muhamuha
        </Typography>
        <Typography variant="h5" align="center" color="inherit" paragraph>
          Get a quick overview of your activity or dive deeper into the details.
          Muha muha the greatest!
        </Typography>
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button variant="contained" sx={{ backgroundColor: 'white', color: '#1976d2', '&:hover': { backgroundColor: '#e3f2fd' } }}>
            Check out course
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

