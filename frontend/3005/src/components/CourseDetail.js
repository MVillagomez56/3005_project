import React from 'react';
import { Card, CardActions, CardContent, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const CourseDetail = ({course}) => {
    const navigate = useNavigate();

    return (
      <Card sx={{ maxWidth: 345, m: 2 }}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            1211212{course.className}

          </Typography>
          <Typography variant="body2" color="text.secondary">
            {course.description}
            {course.class_id}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" onClick={() => navigate(`/courses/${course.class_id}`)}>
            View Details
          </Button>
        </CardActions>
      </Card>
    );
}

