import React, { useState, useEffect } from 'react';
import { Typography, Grid, Box } from '@mui/material';
import CompletedPayments from '../components/CompletedPayments';
import {PendingPayments} from '../components/PendingPayment';


export const Billing = () => {
  const [payments, setPayments] = useState([]);
  const [updateTrigger, setUpdateTrigger] = useState(0); 

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/payments/getPayments'); // Adjust this URL to where your backend is hosted
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }
        const data = await response.json();
        setPayments(data);
        console.log(data);
      } catch (error) {
        console.error('Error fetching payments:', error);
      }
    };

    fetchPayments();
  }, [updateTrigger]);

  return (
    <Box sx={{ textAlign: "center", width: '100%' }}>
      <Typography variant="h4" gutterBottom component="h1">
        Billing Page - Admin View
      </Typography>
      
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={8} lg={6}>
          <Typography variant="h6" component="h2">Completed Payments</Typography>
          <CompletedPayments payments={payments} />
        </Grid>

        <Grid item xs={12} md={8} lg={6}>
          <Typography variant="h6" component="h2">Pending Payments</Typography>
          <PendingPayments payments={payments} triggerRefresh={() => setUpdateTrigger(prev => prev + 1)}/>
        </Grid>
      </Grid>
    </Box>
  );
}
