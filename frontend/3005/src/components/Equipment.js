import React from "react";
import { Box } from "@mui/material";
import { Typography, Button } from "@mui/material";

export const Equipment = () => {
  const [equipment, setEquipment] = React.useState([]);
  const role = JSON.parse(localStorage.getItem("user")).role;
  //fetch equipment
  return (
    <Box>
      <Typography variant="h4">Equipment</Typography>
      {equipment.map((e) => {
        return (
          <Box>
            <Typography>{e.name}</Typography>
            <Typography>{e.description}</Typography>
            <Typography>{e.status}</Typography>
            {
                role === "admin" && (
                    <Box>
                    <Button>Edit</Button>
                    <Button>Delete</Button>
                    </Box>
                )
            }
          </Box>
        );
      })}
    </Box>
  );
};
