import React from 'react';
import { useNavigate } from "react-router-dom";
import { Box, Typography, Container, Button} from '@mui/material';
import errorImage from '../assets/error_image.png'; // Adjust the path as necessary

export const Error = () => {
    const navigate = useNavigate();
    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh'
                }}
            >
                <img src={errorImage} alt="Error" style={{ maxWidth: '100%', marginBottom: '20px' }} />
                <Typography variant="h4" component="h1" gutterBottom>
                    Error
                </Typography>
                <Typography variant="subtitle1">
                    Oops! Something went wrong.
                </Typography>
                <Button onClick={() => navigate('/')} variant="contained" sx={{ marginTop: '20px' }}>
                    Go back to Home
                </Button>
            </Box>
        </Container>
    );
};
