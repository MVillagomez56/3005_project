import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  CardMedia,
  Typography,
  Grid,
} from "@mui/material";
import image from "../assets/success_image.png";
import FeaturedClass from "./FeaturedClass";
export const UpcomingClasses = () => {
  const [upcomingClasses, setUpcomingClasses] = useState([]);

  const fetchUpcomingClasses = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/classes/upcoming");
      const data = await response.json();
      setUpcomingClasses(data);
    } catch (error) {
      console.error("Error fetching upcoming classes: ", error);
    }
  };

  useEffect(() => {
    fetchUpcomingClasses();
  }, []);

  return (
    <div>
      <h1>Upcoming Classes</h1>
      {upcomingClasses.map((upcomingClass) => (
        <FeaturedClass
          courseID={upcomingClass.id}
          title={upcomingClass.name}
          description={upcomingClass.duration}
        />
      ))}
    </div>
  );
};
