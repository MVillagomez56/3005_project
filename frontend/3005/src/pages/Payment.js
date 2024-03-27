import { Typography, Box, Button } from "@mui/material";
import React from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import { AddPaymentMethod } from "../components/AddPaymentMethod";

const Payment = () => {
  //get route params
  const { service, amount } = useParams();

  const { currentUser } = useAuth();
  console.log(currentUser);

  const handleSubmit = () => {
    //send payment to backend
    //redirect to success page
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        padding: "20px",
        borderRadius: "10px",
        margin: "auto",
      }}
    >
      <Typography variant="h1">Please confirm your payment</Typography>
      <Typography variant="h2">{service}</Typography>
      <Typography variant="h2">${amount}</Typography>

      <Typography variant="body">
        Note: We do not offer refunds at the moment for our services!
      </Typography>

      {!currentUser?.has_payment_method && <AddPaymentMethod />}

      <Button
        onClick={handleSubmit}
        disabled={!currentUser?.has_payment_method}
        sx={{
          width: "fit-content",
          padding: "1rem 2rem",
        }}
        variant="contained"
        color="primary"
      >
        Confirm Payment
      </Button>
    </Box>
  );
};

export default Payment;
