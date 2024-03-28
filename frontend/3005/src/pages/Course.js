import React from 'react';
import { Grid, Container, Typography } from '@mui/material';
import { CourseDetail } from '../components/CourseDetail';
import  testingCourse  from '../data/testing_course';

export const Course = () => {
  console.log(testingCourse);
    return (
        <Container maxWidth="lg">
          <Typography variant="h2" gutterBottom>
            Courses
          </Typography>
          <Grid container spacing={4}>
            {testingCourse.map(course => (
              <Grid item key={course.class_id} xs={12} sm={6} md={4}>
                <CourseDetail course={course} />
              </Grid>
            ))}
          </Grid>
        </Container>
      );
}
