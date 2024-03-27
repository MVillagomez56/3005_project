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

  console.log(currentUser);
  console.log('id', id)


  const handleSubmit = () => {
    //send payment to backend
    const response = fetch(
      `http://localhost:5000/users/api/updateMember/paymentInfo/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ cardNumber, ccv, expiryDate }),
      }
    );

    if (!response.status === 200) {
      return new Error("Update failed");
    } else {
      alert("Payment method added successfully");
      localStorage.setItem("user", JSON.stringify({ ...currentUser, has_payment_method: true }));
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
