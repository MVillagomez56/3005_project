import React from 'react';
import { Grid, Card, CardContent, Typography, Button, CardActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import testingRoom from '../data/testing_room';

export const Room = () => {
  const navigate = useNavigate();
  return (
    <div style={{ marginTop: 20, padding: 30 }}>
      <Typography variant="h4" gutterBottom>
        Rooms
      </Typography>
      <Grid container spacing={4}>
        {testingRoom.map((room) => (
          <Grid item key={room.room_id} xs={12} sm={6} md={4}>
            <Card raised sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h5" component="h2">
                  {room.name}
                </Typography>
                <Typography variant="body1">
                  ID: {room.room_id}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Capacity: {room.capacity}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => navigate(`/room/${room.room_id}`)}>
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};
