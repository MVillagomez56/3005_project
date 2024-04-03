import React, { useEffect, useCallback } from "react";
import { Box } from "@mui/system";
import { ProfileInformation } from "../components/ProfileInformation";
import { FitnessGoals } from "../components/FitnessGoals";

export const Profile = () => {
  const currentUser = JSON.parse(localStorage.getItem("user"));

  return (
    <>
      <ProfileInformation {...currentUser} />
      <Box backgroundColor="mistyrose" padding="10px">
        <FitnessGoals {...currentUser} />
      </Box>
    </>
  );
};
