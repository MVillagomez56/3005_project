import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const CompletedPayments = ({ payments }) => {
  return (
    <>
      {payments.filter(payment => payment.completion_status === "Completed").map(payment => (
        <Card key={payment.payment_id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography>Payment ID: {payment.payment_id}</Typography>
            <Typography>Member ID: {payment.member_id}</Typography>
            <Typography>Amount: ${payment.amount}</Typography>
            <Typography>Service: {payment.service}</Typography>
            <Typography>Status: {payment.completion_status}</Typography>
          </CardContent>
        </Card>
      ))}
    </>
  );
};

export default CompletedPayments;
