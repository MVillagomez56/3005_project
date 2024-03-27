import React, { useState } from "react";
import {
  Container,
  TextField,
  Stack,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useAuth } from "../store/AuthContext";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

export const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [date_of_birth, setDateOfBirth] = useState("");
  const [role, setRole] = useState("");

  const navigate = useNavigate();

  const isPasswordValid = () => {
    return (
      password &&
      password.length > 6 &&
      password.length < 20 &&
      password.match(/[0-9]/) &&
      password.match(/[a-zA-Z]/)
    );
  };

  const isEmailValid = () => {
    return email && email.length > 0 && email.includes("@");
  };

  const { signup, isLoggedIn } = useAuth();

  //if already logged in, redirect to dashboard
  if (isLoggedIn) {
    navigate("/");
  }

  const handleSubmit = async () => {
    const loggedIn = await signup(email, password, name, date_of_birth, role);
    if (loggedIn) {
      if (role !== "admin") {
        navigate(`/register/${role}`);
      } else {
        navigate("/");
      }

    } else {
      alert("There was an error signing up");
    }
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
      <h1>Register</h1>
      <Stack direction={"column"} spacing={2}>
        <TextField
          required
          id="outlined-required"
          error={email && !isEmailValid()}
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          required
          error={password && !isPasswordValid()}
          id="outlined"
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          required
          id="outlined"
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <DatePicker
          label="Date of Birth"
          value={date_of_birth ? dayjs(date_of_birth) : null}
          onChange={(newValue) => setDateOfBirth(newValue)}
          renderInput={(params) => <TextField {...params} />}
        />

        <FormControl fullWidth>
          <InputLabel required>Role</InputLabel>
          <Select
            value={role}
            label="role"
            onChange={(e) => setRole(e.target.value)}
          >
            <MenuItem value={"member"}>Member</MenuItem>
            <MenuItem value={"trainer"}>Trainer</MenuItem>
            <MenuItem value={"admin"}>Admin</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          disabled={
            !isEmailValid() ||
            !isPasswordValid() ||
            !name ||
            !date_of_birth ||
            !role
          }
          onClick={handleSubmit}
        >
          Register
        </Button>
        <Typography variant="body1">
          Already have an account? <a href="/login">Login</a>
        </Typography>
      </Stack>
    </Container>
  );
};
