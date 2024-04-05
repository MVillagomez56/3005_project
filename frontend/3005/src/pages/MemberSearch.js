import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Avatar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import memberProfile from "../assets/member_profile.png";

const MemberRow = ({ member }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/profile/${member.id}`);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        width: "300px",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: "2rem" }}>
        <Avatar
          alt={member.name}
          src={memberProfile}
          sx={{ width: 70, height: 70 }}
        />
        <div>
          <Typography variant="h5">{member.name}</Typography>
          <Typography>{member.email}</Typography>
        </div>
      </Box>
      <Button
       variant="contained" onClick={handleClick}>
        View Profile
      </Button>
    </Box>
  );
};

export const MemberSearch = () => {
  const [searchId, setSearchId] = useState("");
  const [searchName, setSearchName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [members, setMembers] = useState([]);

  const navigate = useNavigate();

  const handleSearch = async () => {
    // Clear previous error messages
    setErrorMessage("");

    try {
      const queryParams = new URLSearchParams({
        id: searchId.trim(),
        name: searchName.trim(),
      }).toString();

      const response = await fetch(
        `http://localhost:5000/api/searchMember?${queryParams}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMembers(data);
      } else if (response.status === 404) {
        setErrorMessage("Member not found. Please try again.");
        setMembers([]);
      } else {
        setErrorMessage("An error occurred. Please try again.");
        setMembers([]);
      }
    } catch (error) {
      console.error("Network error:", error);
      setErrorMessage("Network error. Please try again.");
      setMembers([]);
    }
  };

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "calc(100vh - 120px)", // Adjust height calculation as needed
        padding: "20px",
        paddingBottom: "60px", // Additional bottom padding
        boxSizing: "border-box", // Ensure padding doesn't affect the overall dimensions
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{ textAlign: "center", marginBottom: "20px" }}
      >
        Member Search
      </Typography>
      <TextField
        label="Member ID"
        value={searchId}
        onChange={(e) => setSearchId(e.target.value)}
        margin="normal"
        placeholder="Type the member ID"
        fullWidth
        sx={{ marginBottom: "20px" }}
      />
      <TextField
        label="Member Name"
        value={searchName}
        onChange={(e) => setSearchName(e.target.value)}
        margin="normal"
        placeholder="Type the member name"
        fullWidth
        sx={{ marginBottom: "20px" }}
      />
      <Button
        variant="contained"
        onClick={handleSearch}
        size="large"
        sx={{ marginBottom: "20px" }} // Adds space below the button
      >
        Search
      </Button>
      {errorMessage && (
        <Typography color="error" sx={{ marginBottom: "20px" }}>
          {errorMessage}
        </Typography>
      )}
      {members &&
        members.map((member) => <MemberRow key={member.id} member={member} />)}
    </Container>
  );
};
