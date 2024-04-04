import React from "react";
import { Box } from "@mui/system";
import trainerProfile from "../assets/trainer_profile.png";
import memberProfile from "../assets/member_profile.png";
import adminProfile from "../assets/admin_profile.png";
import { IconButton, Typography, Button } from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { InfoField } from "./InfoField";

export const ProfileInformation = ({ currentUser }) => {
  const { role } = currentUser;

  const [edit, setEdit] = React.useState(false);
  const [name, setName] = React.useState(currentUser.name);
  const [email, setEmail] = React.useState(currentUser.email);
  const [password, setPassword] = React.useState(currentUser.password);
  const [date_of_birth, setDateOfBirth] = React.useState(
    currentUser.date_of_birth
  );

  const handleSubmit = async () => {
    const response = await fetch(
      `http://localhost:5000/api/updateUser/${currentUser.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          date_of_birth,
        }),
      }
    );

    if (response.status !== 200) {
      alert("Update failed");
    } else {
      alert("Update successful");
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...currentUser,
          name,
          email,
          password,
          date_of_birth,
        })
      );
      setEdit(false);
    }
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: "3rem",
        padding: "2rem",
      }}
    >
      <img
        src={
          role === "trainer"
            ? trainerProfile
            : role === "member"
            ? memberProfile
            : adminProfile
        }
        alt="profile"
        s
        width={"30%"}
        height="30%"
      ></img>

      <Box width={"30rem"}>
        <Box
          sx={{
            my: 0,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h3">{currentUser.name}</Typography>
            {JSON.parse(localStorage.getItem("user")).id === currentUser.id && (
              <IconButton
                onClick={() => {
                  setEdit(!edit);
                }}
              >
                <EditRoundedIcon />
              </IconButton>
            )}
          </Box>
          <Typography variant="h5">{currentUser.role}</Typography>
        </Box>

        <InfoField label="Name" value={name} setValue={setName} edit={edit} />
        <InfoField
          label="Email"
          value={email}
          setValue={setEmail}
          edit={edit}
        />
        <InfoField
          label="Password"
          value={password}
          setValue={setPassword}
          edit={edit}
        />
        <InfoField
          label="Date of Birth"
          value={date_of_birth.split("T")[0]}
          setValue={setDateOfBirth}
          edit={edit}
        />
        {edit && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: "1rem",
              marginTop: "1rem",
            }}
          >
            <Button
              onClick={() => {
                setEdit(false);
                setName(currentUser.name);
                setEmail(currentUser.email);
                setPassword(currentUser.password);
                setDateOfBirth(currentUser.date_of_birth);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} variant="contained">
              Save
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};
