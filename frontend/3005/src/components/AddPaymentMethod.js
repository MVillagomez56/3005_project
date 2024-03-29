import React from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useAuth } from "../store/AuthContext";

export const AddPaymentMethod = () => {
  const [cardNumber, setCardNumber] = React.useState("");
  const [ccv, setCcv] = React.useState("");
  const [expiryDate, setExpiryDate] = React.useState("");
  const { currentUser } = useAuth();

  const id = JSON.parse(localStorage.getItem("user")).id;

  const handleSubmit = async () => {
    //send payment to backend
    const response = await fetch(
      `http://localhost:5000/api/updateMember/paymentInfo/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ cardNumber, ccv, expiryDate }),
      }
    );

    console.log(response);

    if (response.status !== 200) {
      console.log("Update failed");
      return new Error("Update failed");
    } else {
      console.log("Payment method added successfully");
      alert("Payment method added successfully");
      localStorage.setItem(
        "user",
        JSON.stringify({ ...currentUser, has_payment_method: true })
      );
    }

    //update user payment method
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        padding: "20px",
        border: "1px solid black",
        borderRadius: "10px",
        width: "50%",
      }}
    >
      <Typography variant="h4">
        Please add a payment method before proceeding
      </Typography>

      <TextField
        label="Card Number"
        value={cardNumber}
        onChange={(e) => setCardNumber(e.target.value)}
      />
      <TextField
        label="CCV"
        value={ccv}
        onChange={(e) => setCcv(e.target.value)}
      />

      <DatePicker
        label="Expiry Date"
        value={expiryDate ? dayjs(expiryDate) : null}
        onChange={(date) => setExpiryDate(date)}
        renderInput={(params) => <TextField {...params} />}
      />

      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Add Payment Method
      </Button>
    </Box>
  );
};
