import React from 'react';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import hero from '../assets/hero_image.png';

const Banner = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: `url(${hero})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: isMobile ? '60px 20px' : '120px 20px',
        gap: '20px',
        textAlign: isMobile ? 'center' : 'left',
      }}
    >
      <Box
        sx={{
          maxWidth: isMobile ? '100%' : '50%',
          backgroundColor: 'rgba(0, 0, 0, 0.6)', // Adding a semi-transparent overlay for text contrast
          padding: '20px',
          borderRadius: '10px', // Optional: adds rounded corners for a softer look
        }}
      >
        <Typography
          variant={isMobile ? 'h3' : 'h1'}
          sx={{
            fontWeight: 'bold',
            color: 'white', // Ensuring text is white for contrast
            textShadow: '2px 2px 4px rgba(0,0,0,0.7)', // Enhancing text shadow for better readability
          }}
        >
          Muha Muha Gym
        </Typography>
        <Typography
          variant="h6"
          sx={{
            mt: 2,
            color: 'white', // Keeping text color consistent for readability
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)', // Text shadow for subtitle
          }}
        >
          Build Your Dream Body With Us
        </Typography>
      </Box>
    </Box>
  );
};

export default Banner;
