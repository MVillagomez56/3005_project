import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Grid, Typography, Button, Card, CardContent } from '@mui/material';
import testingCourse from '../data/testing_course';

export const CourseDetail = ({ courses }) => {
  const { courseid } = useParams();
  const course = testingCourse.find(c => c.class_id.toString() === courseid);

  return (
    <Box sx={{ flexGrow: 1,m:30}}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          {/* Placeholder for course image */}
          <Box
            component="img"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            alt={course?.className}
            src="/path/to/your/course/image.jpg" // Replace with your image path
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography gutterBottom variant="h4" component="div">
                {course?.className}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {course?.description}
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                Cost: ${course?.cost}
              </Typography>
              <Typography variant="body1">
                Capacity: {course?.capacity}
              </Typography>
              <Typography variant="body1">
                Trainer ID: {course?.trainerID}
              </Typography>
              <Button 
                variant="contained" 
                sx={{ 
                  mt: 2, 
                  backgroundColor: 'pink', 
                  '&:hover': {
                    backgroundColor: 'deepPink', // Darker pink on hover for better UX
                  },
                }}
              >
                Register
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

