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
        maxWidth: "100vw",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        fontWeight={"bold"}
        textAlign={"center"}
      >
        Upcoming Classes
      </Typography>
      <Box
        sx={{
          display: "flex",
          maxWidth: "100vw", 
          justifyContent: "center", 
          flexDirection: "row",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        {upcomingClasses.map((upcomingClass) => (
          <FeaturedClass
            courseID={upcomingClass.id}
            title={upcomingClass.name}
            description={upcomingClass.description}
            start_time={upcomingClass.start_time}
            end_time={upcomingClass.end_time}
            day={upcomingClass.day}
            approval_status={upcomingClass.payment_status}
            type={upcomingClass.type}
          />
        ))}
        {upcomingClasses.length === 0 && (
          <Typography variant="h6">No upcoming classes</Typography>
        )}
      </Box>
    </Box>
  );
};
