import React, { useEffect, useState } from 'react';
import { Grid, Container, Typography } from '@mui/material';
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
      <Grid container spacing={4}>
        {courses && courses.map(course => (
          <Grid item key={course.id} xs={12} sm={6} md={4}>
            <CourseDetail course={course} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};
