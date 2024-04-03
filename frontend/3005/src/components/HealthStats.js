import React from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { InfoField } from "./InfoField";
import { IconButton } from "@mui/material";
export const HealthStats = (currentUser) => {
  const [height, setHeight] = React.useState(currentUser.height);
  const [weight, setWeight] = React.useState(currentUser.weight);
  const [muscleMass, setMuscleMass] = React.useState(currentUser.muscleMass);
  const [fatMass, setFatMass] = React.useState(currentUser.fatMass);
  const [edit, setEdit] = React.useState(false);
  const [error, setError] = React.useState(false);

  const handleSubmit = async () => {
    localStorage.setItem(
      "user",
      JSON.stringify({
        ...currentUser,
        height,
        weight,
        muscleMass,
        fatMass,
      })
    );

    const response = await fetch(
      `http://localhost:5000/api/updateMember/${currentUser.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          height,
          weight,
          muscle_mass: muscleMass,
          body_fat: fatMass,
        }),
      }
    );

    setEdit(false);
  };
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
      }}
    >
      <Typography variant="h4">
        Health Stats{" "}
        <IconButton onClick={() => setEdit(!edit)}>
          <EditRoundedIcon />
        </IconButton>
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <InfoField
          label="Weight"
          value={weight}
          setValue={setWeight}
          edit={edit}
        />
        <InfoField
          label="Height"
          value={height}
          setValue={setHeight}
          edit={edit}
        />
        <InfoField
          label="Muscle Mass"
          value={muscleMass}
          setValue={setMuscleMass}
          edit={edit}
        />
        <InfoField
          label="Body Fat"
          value={fatMass}
          setValue={setFatMass}
          edit={edit}
        />
        <Button
          variant="contained"
          disabled={!edit || !height || !weight}
          onClick={handleSubmit}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
};
