
import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

export const Footer = () => {
  return (
    <Box sx={{ bgcolor: 'pink', p: 4 }} component="footer"> {/* Updated padding and color */}
      <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
        <Typography variant="h6" component="p">
          Muha Muha Gym
        </Typography>
        <Typography variant="subtitle2" component="p">
        © 2024 Muha Muha Gym. All rights reserved. No part of this website, including text, graphics, logos, images, and information, may be reproduced, distributed, or transmitted in any form or by any means, without the prior written permission of Muha Muha Gym.
        </Typography>
      </Container>
    </Box>
  );
};

