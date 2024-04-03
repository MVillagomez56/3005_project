import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Grid, Typography, Button, Card, CardContent } from '@mui/material';
import courseImage from '../assets/course_image.png';

export const CourseDetail = () => {
  const { courseid } = useParams();
  const [course, setCourse] = useState(null); // Use state to store fetched course

  useEffect(() => {
    // Function to fetch course data from the backend
    const fetchCourse = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/classes/getSpecificClass/${courseid}`);
 // Adjust the URL/port as per your setup
        const data = await response.json();
        setCourse(data); // Set fetched course to state
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };

    if (courseid) {
      fetchCourse();
    }
  }, [courseid]); // Dependency array includes courseid to refetch if it changes

  // Check if course data is not yet fetched
  if (!course) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ flexGrow: 1, m: 30 }}>
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
            alt={course.name}
            src={courseImage} // Replace with your image path
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography gutterBottom variant="h4" component="div">
                {course.name}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {course.description}
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                Cost: ${course.cost}
              </Typography>
              <Typography variant="body1">
                Capacity: {course.capacity}
              </Typography>
              <Typography variant="body1">
                Trainer ID: {course.trainer_id}
              </Typography>
              <Button 
                variant="contained" 
                sx={{ 
                  mt: 2, 
                  backgroundColor: 'pink', 
                  '&:hover': {
                    backgroundColor: 'deepPink',
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
