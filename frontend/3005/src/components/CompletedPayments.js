import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const CompletedPayments = ({ payments }) => {
  return (
    <div style={{ margin: '20px' }}> {/* Container margin */}
      {payments.filter(payment => payment.completion_status === true).map(payment => (
        <Card key={payment.id} sx={{ mb: 2, boxShadow: 3, borderRadius: 2, backgroundColor: '#f9f9f9' }}>
          <CardContent>
            <Typography variant="h6" color="primary" gutterBottom>
              Payment ID: {payment.id}
            </Typography>
            <Typography variant="body1">
              Member ID: {payment.member_id}
            </Typography>
            <Typography variant="body1">
              Amount: <strong>${payment.amount}</strong>
            </Typography>
            <Typography variant="body1">
              Service: {payment.service}
            </Typography>
            <Typography variant="body1" sx={{ color: 'green' }}>
              Status: {payment.completion_status ? "Completed" : "Pending"}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CompletedPayments;
