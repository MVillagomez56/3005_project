import React, { useEffect, useCallback } from "react";
import { Box } from "@mui/system";
import { ProfileInformation } from "../components/ProfileInformation";
import { FitnessGoals } from "../components/FitnessGoals";
import { Typography } from "@mui/material";
import { Button, TextField } from "@mui/material";
import { HealthStats } from "../components/HealthStats";

export const Profile = () => {
  const currentUser = JSON.parse(localStorage.getItem("user"));

  return (
    <>
      <ProfileInformation {...currentUser} />
      <Box
        backgroundColor="mistyrose"
        padding="10px"
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: "2rem",
          padding: "1rem",
          borderRadius: "10px",
          justifyContent: "center",
        }}
      >
        <FitnessGoals {...currentUser} />
        <HealthStats {...currentUser} />
      </Box>
    </>
  );
};
