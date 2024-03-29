import React, { useState } from "react";
import { Container, TextField, Stack, Button, Typography } from "@mui/material";
import { useAuth } from "../store/AuthContext";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/system";

export const MemberRegistration = () => {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [goal, setGoal] = useState("");
  const [goals, setGoals] = useState([]);

  const navigate = useNavigate();
  const { setupComplete, currentUser } = useAuth();

  if (setupComplete) {
    navigate("/"); //redirect to dashboard if already logged in or setup is complete
  }

  const handleSubmit = async () => {
    //put weight and height to users/api/member
    const numWeight = parseInt(weight);
    const numHeight = parseInt(height);
    const response = await fetch(
      `http://localhost:5000/api/updateMember/${currentUser.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ numWeight, numHeight }),
      }
    );

    if (!response.status === 200) {
      return new Error("Update failed");
    }

    ////////

    //post goals to users/api/members-goals
    const response2 = await fetch(
      `http://localhost:5000/api/addFitnessGoals/${currentUser.id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ goals }),
      }
    );

    if (!response2.status === 200) {
      return new Error("Update failed");
    }

    navigate("/payment/membership/100");
  };

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <h1>Let's learn about you and your fitness goals!</h1>
      <Stack direction={"column"} spacing={2}>
        <TextField
          required
          id="outlined-required"
          label="Weight (kg)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
        <TextField
          required
          id="outlined"
          label="Height (m)"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
        />

        <Typography>{`Your BMI is ${weight / (height * height)}.`} </Typography>

        <Typography>What are your fitness goals?</Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <TextField
            required
            id="outlined"
            label="Goals"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          />
          <Button
            onClick={() => {
              setGoals([...goals, goal]);
              setGoal("");
            }}
          >
            Add
          </Button>
        </Box>

        {goals &&
          goals.map((goal, index) => (
            <Box
              display={"flex"}
              flexDirection="row"
              justifyContent="space-between"
            >
              <Typography key={index}>{goal}</Typography>
              <Button onClick={() => setGoals(goals.filter((g) => g !== goal))}>
                Remove
              </Button>
            </Box>
          ))}

        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={!weight || !height || !goals.length}
        >
          Continue
        </Button>
      </Stack>
    </Container>
  );
};
