import React, { useState } from "react";
import { Container, TextField, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const MemberSearch = () => {
  const [searchId, setSearchId] = useState("");
  const [searchName, setSearchName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleSearch = async () => {
    // Clear previous error messages
    setErrorMessage("");

    // Check if both ID and name are provided
    if (!searchId.trim() || !searchName.trim()) {
      setErrorMessage("Both ID and name must be provided for the search.");
      return;
    }

    try {
      const queryParams = new URLSearchParams({
        id: searchId.trim(),
        name: searchName.trim(),
      }).toString();

      const response = await fetch(
        `http://localhost:5000/api/searchMember?${queryParams}`, // Ensure this matches your actual API endpoint
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Navigate to the member's profile page
        // Adjust according to the actual data structure returned by your API
        navigate(`/profile/${data.id}`);
      } else if (response.status === 404) {
        setErrorMessage("Member not found. Please try again.");
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Network error:", error);
      setErrorMessage("Network error. Please try again.");
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
    </Container>
  );
};
