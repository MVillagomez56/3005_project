import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Box,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import courseImage from "../assets/course_image.png";
import { convertTime, dayOfWeek } from "./../utils/time_converter";

export const CourseDetail = () => {
  const { courseid } = useParams();
  const [course, setCourse] = useState(null); // Use state to store fetched course
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch course data from the backend
    const fetchCourse = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/classes/getSpecificClass/${courseid}`
        );
        // Adjust the URL/port as per your setup
        const data = await response.json();
        setCourse(data); // Set fetched course to state
        console.log(data);
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };

    if (courseid) {
      fetchCourse();
    }
  }, [courseid]); // Dependency array includes courseid to refetch if it changes

  const onRegister = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/classes/registerClass`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            member_id: user.id,
            class_id: courseid,
          }),
        }
      );
      console.log(response);
      if (response.status === 201) {
        navigate(`/payment/group-fitness-class/${course.cost}`);
      } else {
        setError("Failed to register for the course");
      }
    } catch (error) {
      console.error("Error registering for course:", error);
      setError("Failed to register for the course");
    }
  };

  // Check if course data is not yet fetched
  if (!course) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ flexGrow: 1, py: "2rem" }}>
      <Box
        sx={{
          display: "flex",
          gap: "2rem",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          flexDirection: { sm: "column", md: "row" },
        }}
      >
        {/* Placeholder for course image */}
        <Box
          component="img"
          sx={{
            width: { sm: "100%", md: "50%" },
            objectFit: "cover",
          }}
          alt={course.name}
          src={courseImage} // Replace with your image path
        />
        <Card
          sx={{
            width: "50%",
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              alignItems: "center",
            }}
          >
            <Typography gutterBottom variant="h4" component="div">
              {course.name}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {course.description}
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Cost: ${course.cost}
            </Typography>
            <Typography variant="body1">Capacity: {course.capacity}</Typography>
            <Typography variant="body1">
              {`Trainer Name: `}
              <Link to={`/profile/${course.trainer_id}`}>
                {course.trainer_name}
              </Link>
            </Typography>
            <Typography variant="body1">
              Time: {convertTime(course.start_time)} -{" "}
              {convertTime(course.end_time)} on {dayOfWeek[course.day]}
            </Typography>

            <Button
              variant="contained"
              disabled={user.role !== "member"}
              sx={{
                mt: 2,
                backgroundColor: "pink",
                "&:hover": {
                  backgroundColor: "deepPink",
                },
              }}
              onClick={onRegister}
            >
              Register
            </Button>
            {error && <Typography color="error">{error}</Typography>}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};
