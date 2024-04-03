import React, { useState } from "react";
import { Container, TextField, Stack, Button, Typography } from "@mui/material";
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

    try{
      const loggedIn = await login(email, password);
      if (loggedIn) {
        navigate("/");
      } else {
        alert("Invalid credentials");
      }
    }
    catch(err){
      console.log(err);
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
        <Typography variant="body1">Don't have an account? <a href="/register">Register</a></Typography>
      </Stack>
    </Container>
  );
};
