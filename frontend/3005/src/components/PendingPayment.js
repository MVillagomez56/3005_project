import React from 'react';
import { Button, Card, CardContent, Typography } from '@mui/material';

export const PendingPayments = ({ payments, onPaymentAction }) => {
  return (
    <>
      {payments.filter(payment => payment.completion_status === "Pending").map(payment => (
        <Card key={payment.payment_id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography>Payment ID: {payment.payment_id}</Typography>
            <Typography>Member ID: {payment.member_id}</Typography>
            <Typography>Amount: ${payment.amount}</Typography>
            <Typography>Service: {payment.service}</Typography>
            <Typography>Status: {payment.completion_status}</Typography>
            <Button 
              variant="contained" 
              color="success" 
            //   onClick={() => onPaymentAction(payment.payment_id, "Completed")}
              sx={{ mr: 1 }}
            >
              Approve
            </Button>
            <Button 
              variant="contained" 
              color="error" 
            //   onClick={() => onPaymentAction(payment.payment_id, "Declined")}
            >
              Decline
            </Button>
          </CardContent>
        </Card>
      ))}
    </>
  );
};