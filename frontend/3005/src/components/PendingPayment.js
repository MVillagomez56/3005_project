import React from 'react';
import { Button, Card, CardContent, Typography } from '@mui/material';

export const PendingPayments = ({ payments,triggerRefresh }) => {
  const handleApprovePayment = async (paymentId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/payments/approvePayment/${paymentId}`, {
        method: 'POST', // Assuming your backend uses POST for these operations
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to approve payment');
      }
      const data = await response.json();
      console.log('Payment approved:', data);
      // Update your local state or trigger a re-fetch here as needed
    } catch (error) {
      console.error('Error approving payment:', error);
    }
    triggerRefresh();
  };


  const handleDeclinePayment = async (paymentId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/payments/declinePayment/${paymentId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to decline payment');
      }
      const data = await response.json();
      console.log('Payment declined:', data);
      // Update your local state or trigger a re-fetch here as needed
    } catch (error) {
      console.error('Error declining payment:', error);
    }
    triggerRefresh();
  };

  return (
    <>
      {payments.filter(payment => payment.completion_status === false).map(payment => (
        <Card key={payment.id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography>Payment ID: {payment.id}</Typography>
            <Typography>Member ID: {payment.member_id}</Typography>
            <Typography>Amount: ${payment.amount}</Typography>
            <Typography>Service: {payment.service}</Typography>
            <Typography>Status: {payment.completion_status ? "Completed" : "Pending"}</Typography>

            <Button 
              variant="contained" 
              color="success" 
              onClick={() => handleApprovePayment(payment.id)}
            //   onClick={() => onPaymentAction(payment.payment_id, "Completed")}
              sx={{ mr: 1 }}
            >
              Approve
            </Button>
            <Button s
              variant="contained" 
              color="error"
              onClick={() => handleDeclinePayment(payment.id)}
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