import React from "react";
import success from "../assets/success_image.png";
import { Button } from "@mui/material";
import { Box } from "@mui/system";

const RegisterComplete = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "2rem",
        padding: "1rem",
      }}
    >
      <h1>You're all set! Welcome to the Muha Muha route to fitness!</h1>
      <img src={success} alt="success" width="50%" height="50%"></img>
      <Button variant="contained" color="primary" href="/">
        Click here to go to the home page
      </Button>
    </Box>
  );
};

export default RegisterComplete;
