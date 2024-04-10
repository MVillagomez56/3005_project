import React, { useMemo } from "react";
import {
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export const CourseDetail = ({ course }) => {
  const navigate = useNavigate();
  console.log(course);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const canEdit = () =>{
    if (
      (user.role === "trainer" || user.role === "admin") &&
      course.type === "group"
    ) {
      return true;
    }
    if (user.role === "member" && course.type === "personal") {
      return true;
    } else {
      return false;
    }
  }
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
        {canEdit() && (
          <Button
            size="small"
            onClick={() => navigate(`/courses/edit/${course.id}`)}
          >
            Edit
          </Button>
        )}
      </CardActions>
    </Card>
  );
};
