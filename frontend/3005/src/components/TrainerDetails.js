
import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

export const TrainerDetails = ({ trainerId }) => {
    const [trainerInfo, setTrainerInfo] = useState({ specialization: '', cost: 0 });

    useEffect(() => {
        const fetchTrainerInfo = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/trainers/${trainerId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch trainer details');
                }

                const data = await response.json();
                setTrainerInfo(data);
            } catch (error) {
                console.error('Error fetching trainer details:', error);
            }
        };

        fetchTrainerInfo();
    }, [trainerId]);

    return (
        <Box sx={{ mb: 2 }}>
            <Typography variant="h6">Specialization: {trainerInfo.specialization}</Typography>
            <Typography variant="h6">Cost: ${trainerInfo.cost}</Typography>
        </Box>
    );
};

