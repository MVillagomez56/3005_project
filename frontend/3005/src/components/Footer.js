import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

export const Footer = () => {
  return (
    <Box sx={{ bgcolor: 'pink', p: 4 }} component="footer"> {/* Updated padding and color */}
      <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
        <Typography variant="h6" component="p">
          Website Name
        </Typography>
        <Typography variant="subtitle1" component="p">
          Contact Email: 12456@gmail.com
        </Typography>
      </Container>
    </Box>
  );
};
