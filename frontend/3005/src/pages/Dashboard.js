import React, { useCallback, useEffect, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import Banner from "../components/Banner";
import { Hero } from "../components/Hero";
import { FeaturedClasses } from "../components/FeaturedClasses";
import { FitnessGoals } from "../components/FitnessGoals";
import { HealthStats } from "../components/HealthStats";
import { UpcomingClasses } from "../components/UpcomingClasses";
import {TrainerSchedule} from "../components/trainerSchedule";
import { EquipmentStatus } from "../components/EquipmentStatus";

// temporary data for testing, should be deleted once database data is being implemented

export const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [acheivedGoals, setAcheivedGoals] = useState([]);

  console.log(acheivedGoals);
  const fetchFitnessGoals = useCallback(async () => {
    const response = await fetch(
      `http://localhost:5000/api/fitnessGoals/${user.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    if (!response) {
      return new Error("Failed to fetch fitness goals");
    }

    if (response.status !== 200) {
      return new Error("Failed to fetch fitness goals");
    }

    const data = await response.json();
    setAcheivedGoals(data.filter((goal) => goal.status));
    console.log("data", data);
  }, [user.id]);

  useEffect(() => {
    fetchFitnessGoals();
  }, [fetchFitnessGoals]);

  return (
    <div>
      <Box>
        <Banner />
      </Box>
      <Hero />
      <div style={{ margin: 60 }}>
        <Typography variant="h4" fontWeight={"bold"}>
          Featured Classes
        </Typography>
        <Grid container spacing={3}>
          <FeaturedClasses />
        </Grid>
      </div>
      {user.role ==="trainer" && (
        <div>
          <Typography variant="h4" fontWeight={"bold"}>
            Trainer Schedule
          </Typography>
          <TrainerSchedule/>
        </div>
      
      )}
      {user.role === "admin" && (
        <div>
          <EquipmentStatus/>
        </div>)}
      {user.role === "member" && (
        <>
          <div>
            <UpcomingClasses id={user.id} />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1rem",
                backgroundColor: "mistyrose",
                margin: 10,
                padding: "2rem",
                borderRadius: 5,
              }}
            >
              <Typography
                variant="h4"
                fontWeight={"bold"}
                style={{ marginTop: 20 }}
              >
                Achievements
              </Typography>
              <Typography variant="h6">
                You've accomplished your goal(s) of:
              </Typography>
              {acheivedGoals.length === 0 ? (
                <Typography variant="h6" style={{ marginTop: 20 }}>
                  No goals achieved yet
                </Typography>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: "1rem",
                  }}
                >
                  {acheivedGoals.map((goal) => (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                        border: "1px solid #ccc",
                        boxShadow: 1,
                        backgroundColor: "white",
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        width: "100%",
                      }}
                    >
                      <Typography>{goal.goal}</Typography>
                      <Typography>
                        {goal.completion_date.split("T")[0]}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </div>
          <EquipmentStatus/>
          <Box backgroundColor="mistyrose" padding>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: "2rem",
                justifyContent: "center",
              }}
            >
              <FitnessGoals currentUser={user} />
              <HealthStats {...user} />
            </Box>
          </Box>
        </>
      )}
    </div>
  );
};
