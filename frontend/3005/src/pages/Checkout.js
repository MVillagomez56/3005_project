import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import CompletedPayments from "../components/CompletedPayments";

export const Checkout = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [payments, setPayments] = useState([]); // Use state to store fetched payments
  const fetchMemberPayments = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/payments/getMemberPayments/${user.id}`
      );
      const data = await response.json();
      console.log(data);
      setPayments(data);
    } catch (error) {
      console.error("Error fetching member payments:", error);
    }
  };

  const handleCancelPayment = async (paymentId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/payments/cancelPayment/${paymentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to cancel payment");
      }
      fetchMemberPayments();
    } catch (error) {
      console.error("Error cancelling payment:", error);
    }
  };

  useEffect(() => {
    fetchMemberPayments();
  }, [user.id]); // Dependency array includes user.id to refetch if it changes

  return (
    <Box
      sx={{
        padding: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Grid item xs={12} md={8} lg={6}>
        <Typography
          sx={{ textAlign: "center", width: "100%" }}
          variant="h3"
          component="h2"
        >
          Completed Payments
        </Typography>
        <CompletedPayments payments={payments} />
      </Grid>
      <Grid item xs={12} md={8} lg={6}>
        <Typography
          sx={{ textAlign: "center", width: "100%" }}
          variant="h3"
          component="h2"
        >
          Pending Payments
        </Typography>
        {payments
          .filter((payment) => !payment.completion_status)
          .map((payment) => (
            <Card key={payment.id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography>Payment ID: {payment.id}</Typography>
                <Typography>Member ID: {payment.member_id}</Typography>
                <Typography>Amount: ${payment.amount}</Typography>
                <Typography>Service: {payment.service}</Typography>
                <Typography>
                  Status: {payment.completion_status ? "Completed" : "Pending"}
                </Typography>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => handleCancelPayment(payment.id)}
                  //   onClick={() => onPaymentAction(payment.payment_id, "Completed")}
                  sx={{ mr: 1 }}
                >
                  Cancel
                </Button>
              </CardContent>
            </Card>
          ))}
        {!payments.filter((payment) => !payment.completion_status).length && (
          <Typography
            sx={{ textAlign: "center", width: "100%" }}
            variant="h5"
            component="h2"
            color={"textSecondary"}
          >
            No pending payments
          </Typography>
        )}
      </Grid>
    </Box>
  );
};
