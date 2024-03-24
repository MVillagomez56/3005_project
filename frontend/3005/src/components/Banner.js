import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import hero from '../assets/hero_image.png';

const Banner = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'pink',
        color: 'white',
        padding: '20px',
        gap: '20px',
      }}
    >
        <img src={hero} alt="hero" />
      <Typography variant="h1" width={'50%'} color={'black'}>
        Muha Muha Gym
      </Typography>
     
    </Box>
  );
};

export default Banner;
