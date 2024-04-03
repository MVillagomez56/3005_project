import React, { useState } from 'react';
import { Typography, Grid, Box } from '@mui/material';
import CompletedPayments from '../components/CompletedPayments';
import {PendingPayments} from '../components/PendingPayment';
import testingPaymentData from "../data/testing_payment";


export const Billing = () => {
  return (
    <Box sx={{ textAlign: "center", width: '100%' }}> {/* Use Box with sx prop for styling */}
      <Typography variant="h4" gutterBottom component="h1">
        Billing Page - Admin View
      </Typography>
      
      <Grid container spacing={3} justifyContent="center"> {/* Add justifyContent to center Grid items */}
        <Grid item xs={12} md={8} lg={6}> {/* Adjust sizes as needed for your design */}
          <Typography variant="h6" component="h2">Completed Payments</Typography>
          <CompletedPayments payments={testingPaymentData} />
        </Grid>

        <Grid item xs={12} md={8} lg={6}>
          <Typography variant="h6" component="h2">Pending Payments</Typography>
          <PendingPayments payments={testingPaymentData} />
        </Grid>
      </Grid>
    </Box>
  );
}
