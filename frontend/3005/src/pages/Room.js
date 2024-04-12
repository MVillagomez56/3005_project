import React from 'react';
import { Grid, Card, CardContent, Typography, CardMedia } from '@mui/material';
import testingRoom from '../data/testing_room';
import roomImage from '../assets/room_image.png';

export const Room = () => {
  return (
    <div style={{ marginTop: 20, padding: 30 }}>
      <Typography variant="h4" gutterBottom>
        Rooms
      </Typography>
      <Grid container spacing={4}>
        {testingRoom.map((room) => (
          <Grid item key={room.room_id} xs={12} sm={6} md={4}>
            <Card raised sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="140"
                image={roomImage}
                alt="Room image"
              />
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
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};
