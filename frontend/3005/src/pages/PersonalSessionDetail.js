import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// Grouped import from @mui/material
import {
  Container,
  Typography,
  Paper,
} from "@mui/material";

export const PersonalSessionDetail = () => {
  const { id } = useParams();
  const [trainer, setTrainer] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // Assuming you want to handle success messages

  useEffect(() => {
    const fetchTrainerDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/trainer/${id}`);
        if (!response.ok) {
          throw new Error('Could not fetch trainer details.');
        }
        const data = await response.json();
        setTrainer(data);
      } catch (error) {
        console.error("Error fetching trainer details:", error);
        setError(error.message);
      }
    };

    fetchTrainerDetails();
  }, [id]);

  return (
    <Container maxWidth="sm" sx={{ marginTop: "2rem" }}>
      <Paper elevation={3} sx={{ padding: "2rem", textAlign: "center" }}>
        {error && <Typography color="error">{error}</Typography>}
        {successMessage && (
          <Typography color="success">{successMessage}</Typography>
        )}
        {trainer ? (
          <>
            <Typography variant="h4" gutterBottom>
              {trainer.name}
            </Typography>
            <Typography variant="h5">${trainer.cost} /hr</Typography>
            {/* Additional details can be included here if necessary */}
          </>
        ) : (
          <Typography>Loading...</Typography>
        )}
      </Paper>
    </Container>
  );
};
