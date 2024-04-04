import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const CompletedPayments = ({ payments }) => {
  return (
    <>
      {payments.filter(payment => payment.completion_status === true).map(payment => (
        <Card key={payment.id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography>Payment ID: {payment.id}</Typography>
            <Typography>Member ID: {payment.member_id}</Typography>
            <Typography>Amount: ${payment.amount}</Typography>
            <Typography>Service: {payment.service}</Typography>
            <Typography>Status: {payment.completion_status ? "Completed" : "Pending"}</Typography>
          </CardContent>
        </Card>
      ))}
    </>
  );
};

export default CompletedPayments;
