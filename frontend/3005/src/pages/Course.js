import React, { useEffect, useState } from 'react';
import { Grid, Container, Typography, Box } from '@mui/material';
import { CourseDetail } from '../components/CourseDetail';
// Remove the import for testingCourse since we'll fetch data from the backend

export const Course = () => {
  const [courses, setCourses] = useState([]); // State to store fetched courses

  useEffect(() => {
    // Function to fetch courses data
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/classes/getclasses'); // Adjust the URL/port as per your setup
        const data = await response.json();
        setCourses(data); // Set fetched data to state
        console.log(data);
      } catch (error) {
        console.error("Error fetching courses data:", error);
      }
    };

    fetchCourses(); // Call the fetch function
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <Container maxWidth="lg">
      <Typography variant="h2" gutterBottom>
        Courses
      </Typography>
      <Box sx={{ marginBottom: 2,
      display: 'flex',
      flexWrap: 'wrap',
      gap: 2,
      justifyContent: 'center',
      width: '100%'
      }}>
        {courses && courses.map(course => (
            <CourseDetail course={course} />
        ))}
      </Box>
    </Container>
  );
};
