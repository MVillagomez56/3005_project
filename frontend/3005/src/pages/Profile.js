import React, { useEffect, useCallback } from "react";
import { Box } from "@mui/system";
import { ProfileInformation } from "../components/ProfileInformation";
import { FitnessGoals } from "../components/FitnessGoals";
import { Typography } from "@mui/material";
import { Button, TextField } from "@mui/material";
import { HealthStats } from "../components/HealthStats";
import { useParams } from "react-router-dom";
import { TrainerScheduleSetter } from "../components/TrainerScheduleSetter";
import { TrainerApprovedClasses } from "../components/TrainerApprovedClasses";
import { SpecializationUpdater } from '../components/SpecializationUpdater';

export const Profile = () => {
  const { id } = useParams();
  const [currentUser, setCurrentUser] = React.useState({});
  const fetchCurrentUser = useCallback(async () => {
    const response = await fetch(`http://localhost:5000/api/user/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!response) {
      return new Error("Failed to fetch member");
    }
    if (response.status !== 200) {
      return new Error("Failed to fetch member");
    }

    const data = await response.json();
    console.log("fetchCurrentUser", data);
    setCurrentUser(data);
  }, [id]);

  const saveSchedule = async (day, startTime, endTime) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/trainers/schedule/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ day, startTime, endTime }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update schedule");
      }

      alert("Schedule updated successfully!");
    } catch (error) {
      console.error("Error updating schedule:", error);
      alert("Failed to update schedule.");
    }
  };

  const saveSpecialization = async (specialization, cost) => {
    try {
      const response = await fetch(`http://localhost:5000/api/trainers/update/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ specialization, cost }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update specialization and cost");
      }
  
      alert("Specialization and cost updated successfully!");
    } catch (error) {
      console.error("Error updating specialization and cost:", error);
      alert("Failed to update specialization and cost.");
    }
  };
  

  console.log("Profile.js", id);
  useEffect(() => {
    console.log("HELP");

    fetchCurrentUser();
  }, [fetchCurrentUser]);

  if (currentUser.name === undefined) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <ProfileInformation currentUser={currentUser} />
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
        {currentUser.role === "member" && (
          <>
            <FitnessGoals currentUser={currentUser} />
            <HealthStats id={id} />
          </>
        )}
        {currentUser.role === "trainer" && (
          <Box>
            <SpecializationUpdater
              trainerId={id}
              onUpdate={saveSpecialization}
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: "2rem",
                padding: "1rem",
                justifyContent: "center",
              }}
            >
              <TrainerScheduleSetter trainerId={id} onSave={saveSchedule} />
              <TrainerApprovedClasses trainerId={id} />
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};
