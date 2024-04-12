import React, { useState } from "react";
import {
  Container,
  TextField,
  Stack,
  Button,
  Typography,
  Box,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useAuth } from "../store/AuthContext";
import { useNavigate } from "react-router-dom";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { Grid } from "@mui/material";
import { dayOfWeek } from "../utils/time_converter";

export const TrainerRegistration = () => {
  const [specialization, setSpecialization] = useState("");
  const [cost, setCost] = useState("");
  const [scheduledHours, setScheduledHours] = useState([]); // [{day:0, start_time: "00:00", end_time: "00:00", available: true}, ...]

  const navigate = useNavigate();
  const { setupComplete, currentUser } = useAuth();

  if (setupComplete) {
    navigate("/"); //redirect to dashboard if already logged in or setup is complete
  }

  const isCostValid = () => {
    return cost && cost.length > 0 && !isNaN(cost);
  };

  const isScheduledHoursSetCorrectly = () => {
    //IF A DAY IS AVAILABLE, END TIME AND START TIME SHOULD BE SET
    for (let i = 0; i < scheduledHours.length; i++) {
      if (scheduledHours[i]?.available) {
        if (!scheduledHours[i]?.start_time || !scheduledHours[i]?.end_time) {
          return true;
        }
      }
    }
    return false;
  };

  const handleSubmit = async () => {
    console.log("Submitting form", scheduledHours);
    const _scheduledHours = scheduledHours.map((hour) => {
      if (hour?.available) {
        return {
          start_time: hour.start_time.toDate().toTimeString().slice(0, 8),
          end_time: hour.end_time.toDate().toTimeString().slice(0, 8)
        };
      }
      return null;
    });

    console.log("Scheduled Hours: ", _scheduledHours);
    const response = await fetch(
      `http://localhost:5000/api/trainers/updateTrainer/${currentUser.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ specialization, cost }),
      }
    );

    if (response.status !== 200) {
      return new Error("Update failed");
    }

    localStorage.setItem(
      "user",
      JSON.stringify({ ...currentUser, specialization, cost })
    );

    console.log(_scheduledHours)

    ////////

    //post scheduled hours to users/api/trainers-scheduled-hours

    //scheduledHours: [{day:0, start_time: "00:00", end_time: "00:00", available: true}, ...]

    const response2 = await fetch(
      `http://localhost:5000/api/trainers/addTrainerSchedule/${currentUser.id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ scheduledHours: _scheduledHours }),
      }
    );

    if (response2.status !== 200) {
      return new Error("Update failed");
    }

    navigate("/");
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
      <h1>Welcome new trainer! Let's learn more about you. </h1>
      <Stack direction={"column"} spacing={2}>
        <TextField
          required
          id="outlined-required"
          label="Specialization"
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
        />
        <TextField
          required
          id="outlined"
          label="How much do you charge per hour?"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
        />

        <Typography>What are your scheduled hours?</Typography>

        <Grid container spacing={2}>
          {Object.keys(dayOfWeek).map((day, index) => (
            <Grid item xs={2} key={index}>
              <Typography>{dayOfWeek[day]}</Typography>
              <TimePicker
                value={scheduledHours[index]?.start_time}
                label="Start Time"
                disabled={!scheduledHours[index]?.available}
                onChange={(date) => {
                  const newHours = [...scheduledHours];
                  newHours[index] = {
                    ...newHours[index],
                    start_time: date,
                  };
                  setScheduledHours(newHours);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
              <TimePicker
                value={scheduledHours[index]?.end_time}
                label="End Time"
                disabled={!scheduledHours[index]?.available}
                onChange={(date) => {
                  const newHours = [...scheduledHours];
                  newHours[index] = {
                    ...newHours[index],
                    end_time: date,
                  };
                  setScheduledHours(newHours);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      value={scheduledHours[index]?.available}
                      onChange={(e) => {
                        const newHours = [...scheduledHours];
                        newHours[index] = {
                          ...newHours[index],
                          available: e.target.checked,
                        };
                        setScheduledHours(newHours);
                      }}
                    />
                  }
                  label="Available?"
                />
              </FormGroup>
            </Grid>
          ))}
        </Grid>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={
            !specialization || !isCostValid() || isScheduledHoursSetCorrectly()
          }
        >
          Continue
        </Button>
      </Stack>
    </Container>
  );
};
