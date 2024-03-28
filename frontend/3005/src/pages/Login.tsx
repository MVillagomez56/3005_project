import React, { useState } from "react";
<<<<<<< HEAD
import { Container, TextField, Stack, Button } from "@mui/material";
=======
import { Container, TextField, Stack, Button, Typography } from "@mui/material";
>>>>>>> 7d8605674b909fc582c7265d06ac77dc1647624b
import { useAuth } from "../store/AuthContext";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); 

  const { login, currentUser } = useAuth();

  //if already logged in, redirect to dashboard
  if (currentUser) {
    navigate("/");
  }

  const handleSubmit = async () => {
    const loggedIn = await login(email, password);

    if (loggedIn) {
      navigate("/");
    } else {
      alert("Invalid credentials");
    }

  }


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
      <h1>Login</h1>
      <Stack direction={"column"} spacing={2}>
        <TextField
          required
          id="outlined-required"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          required
          id="outlined"
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button variant="contained" onClick={handleSubmit}>Login</Button>
<<<<<<< HEAD
=======
        <Typography variant="body1">Don't have an account? <a href="/register">Register</a></Typography>
>>>>>>> 7d8605674b909fc582c7265d06ac77dc1647624b
      </Stack>
    </Container>
  );
};
