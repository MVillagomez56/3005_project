import React, { useEffect, useCallback } from "react";
import { useAuth } from "../store/AuthContext";
import { Box } from "@mui/system";
import { ProfileInformation } from "../components/ProfileInformation";
import { Typography } from "@mui/material";

export const Profile = () => {
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [fitnessGoals, setFitnessGoals] = React.useState([]);
  const fetchFitnessGoals = useCallback(async () => {
    const response = await fetch(
      `http://localhost:5000/api/fitnessGoals/${currentUser.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    if (response.status !== 200) {
      return new Error("Failed to fetch fitness goals");
    }

    const data = await response.json();
    setFitnessGoals(data.goals);
    console.log(data);
  }, [currentUser.id]);

  useEffect(() => {
    fetchFitnessGoals();
  }, [fetchFitnessGoals]);

  return (
    <>
      <ProfileInformation {...currentUser} />
      <Box backgroundColor="mistyrose" padding="10px">
        <Box>
          <Typography variant="h4">Fitness Goals! To do</Typography>
        </Box>
      </Box>
    </>
  );
};
