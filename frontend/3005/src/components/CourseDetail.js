import React from 'react';
import { Card, CardActions, CardContent, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const CourseDetail = ({course}) => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return (
      <Card sx={{ maxWidth: 345, m: 2 }}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {course.name}

          </Typography>
          <Typography variant="body2" color="text.secondary">
            {course.description}
            {course.class_id}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" onClick={() => navigate(`/courses/${course.id}`)}>
            View Details
          </Button>
          {user.role === "trainer" && (
            <Button size="small" onClick={() => navigate(`/courses/edit/${course.id}`)}>
              Edit
            </Button>
          )}
        </CardActions>
      </Card>
    );
}

