import { Typography, Box, Button } from "@mui/material";
import React from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import { AddPaymentMethod } from "../components/AddPaymentMethod";
import { useNavigate } from "react-router-dom";

export const  Payment = () => {
  //get route params
  const [error, setError] = React.useState(null);
  const { service, amount } = useParams();

  const { currentUser } = useAuth();
  const naviagate = useNavigate();
  console.log(currentUser);

  if (
    service !== "membership" &&
    service !== "personal-fitness-class" &&
    service !== "group-fitness-class"
  ) {
    naviagate("/");
  }

  if (service === "membership" && currentUser?.setup_complete) {
    naviagate("/");
  }

  const serviceName = service.replace(/-/g, " ");

  const handleSubmit = async () => {
    const member_id = JSON.parse(localStorage.getItem("user")).id;

    const response = await fetch(`http://localhost:5000/api/addPayment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        service: serviceName,
        amount,
        member_id,
        payment_date: new Date(),
      }),
    });

    console.log(response);

    if (response.status !== 201) {
      setError("Payment failed");
    } else {
      alert("Payment successful!");
      if (service === "membership") {
        localStorage.setItem(
          "user",
          JSON.stringify({ ...currentUser, setup_complete: true })
        );
        naviagate("/register/complete");
      } else {
        naviagate("/");
      }
    }
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
      <Typography variant="h2">{serviceName}</Typography>
      <Typography variant="h2">${amount}</Typography>

      <Typography variant="body">
        Note: We do not offer refunds at the moment for our services!
      </Typography>

      {!currentUser?.has_payment_method && <AddPaymentMethod />}

      {error && <Typography variant="body">{error}</Typography>}
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

