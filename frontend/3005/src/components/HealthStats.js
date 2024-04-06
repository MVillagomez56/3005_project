import React from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { InfoField } from "./InfoField";
import { IconButton } from "@mui/material";
export const HealthStats = ({ id }) => {
  const [height, setHeight] = React.useState(0);
  const [weight, setWeight] = React.useState(0);
  const [muscleMass, setMuscleMass] = React.useState(0);
  const [fatMass, setFatMass] = React.useState(0);
  const [edit, setEdit] = React.useState(false);
  const [error, setError] = React.useState(false);

  const isOwner = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user.id === id;
  };

  const fetchCurrentMember = async () => {
    const response = await fetch(`http://localhost:5000/api/member/${id}`, {
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
    setHeight(data.height);
    setWeight(data.weight);
    setMuscleMass(data.muscle_mass);
    setFatMass(data.body_fat);
  };

  React.useEffect(() => {
    fetchCurrentMember();
  }, []);

  const handleSubmit = async () => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
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
        Health Stats
        {isOwner && (
          <IconButton onClick={() => setEdit(!edit)}>
            <EditRoundedIcon />
          </IconButton>
        )}
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
          disabled={!edit || !height || !weight || !isOwner}
          onClick={handleSubmit}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
};
