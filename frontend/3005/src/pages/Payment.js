import { Typography, Box, Button } from "@mui/material";
import React from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import { AddPaymentMethod } from "../components/AddPaymentMethod";
import { useNavigate } from "react-router-dom";

export const  Payment = () => {
  //get route params
  const currentUser  = JSON.parse(localStorage.getItem("user"));

  const [error, setError] = React.useState(null);
  const [hasPaymentMethod, setHasPaymentMethod] = React.useState(currentUser?.has_payment_method);
  const { service, amount } = useParams();
  const [serviceName, setServiceName] = React.useState("");
  

  const naviagate = useNavigate();
  console.log(currentUser);

  if (service === "membership" && currentUser?.setup_complete) {
    naviagate("/");
  }

  const fetchMemberPaymentInfo = async () => {
    const response = await fetch(`http://localhost:5000/api/member/paymentInfo/${currentUser.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (response.status !== 200) {
      setError("Failed to fetch member info");
    } else {
      const data = await response.json();
      setHasPaymentMethod(!!data.ccv);
    }
  }


  //if service is number, fetch relevant class
  const fetchService = async () => {
    const response = await fetch(`http://localhost:5000/api/classes/getSpecificClass/${service}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (response.status !== 200) {
      setError("Failed to fetch service");
    } else {
      const data = await response.json();
      setServiceName(data.name);
    }
  }

  React.useEffect(() => {
    fetchService();
    fetchMemberPaymentInfo();
  }, []);


  const handleSubmit = async () => {
    const member_id = JSON.parse(localStorage.getItem("user")).id;

    const response = await fetch(`http://localhost:5000/api/addPayment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        service,
        amount,
        member_id,
        payment_date: new Date(),
      }),
    });

    console.log(response);

    if (response.status !== 201) {
      setError("Payment failed");
    } else {
      alert("Payment successful!");
      if (service === "membership") {
        localStorage.setItem(
          "user",
          JSON.stringify({ ...currentUser, setup_complete: true })
        );
        naviagate("/register/complete");
      } else {
        naviagate("/");
      }
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        padding: "20px",
        borderRadius: "10px",
        margin: "auto",
      }}
    >
      <Typography variant="h1">Please confirm your payment</Typography>
      <Typography variant="h2">{service === "membership" ? "Membership" : serviceName}</Typography>
      <Typography variant="h2">${amount}</Typography>

      <Typography variant="body">
        Note: We do not offer refunds at the moment for our services!
      </Typography>

      {!hasPaymentMethod && <AddPaymentMethod setHasPaymentMethod={setHasPaymentMethod} />}

      {error && <Typography variant="body">{error}</Typography>}
      <Button
        onClick={handleSubmit}
        disabled={!hasPaymentMethod}
        sx={{
          width: "fit-content",
          padding: "1rem 2rem",
        }}
        variant="contained"
        color="primary"
      >
        Confirm Payment
      </Button>
    </Box>
  );
};

