import React, { useState, useEffect } from "react";
import FeaturedClass from "./FeaturedClass";
import { Grid, Typography, Box } from "@mui/material";
export const UpcomingClasses = ({ id }) => {
  const [upcomingClasses, setUpcomingClasses] = useState([]);

  const fetchUpcomingClasses = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/classes/upcomingClasses/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      const data = await response.json();
      setUpcomingClasses(data);
    } catch (error) {
      console.error("Error fetching upcoming classes: ", error);
    }
  };

  useEffect(() => {
    fetchUpcomingClasses();
  }, []);

  console.log(upcomingClasses);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        padding: "3rem",
        borderRadius: "10px",
        maxWidth: "50%",
        backgroundColor: "white",
        mx: "auto",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        component={"div"}
        textAlign={"center"}
      >
        Upcoming Classes
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        {upcomingClasses.map((upcomingClass) => (
          <FeaturedClass
            courseID={upcomingClass.id}
            title={upcomingClass.name}
            description={upcomingClass.description}
            start_time={upcomingClass.start_time}
            end_time={upcomingClass.end_time}
            day={upcomingClass.day}
          />
        ))}
      </Box>
    </Box>
  );
};
