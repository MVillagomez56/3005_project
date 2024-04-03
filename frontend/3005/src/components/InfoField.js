import { Box, TextField, Typography } from "@mui/material";

export const InfoField = ({ label, value, setValue, edit }) => {
  const valueToDisplay = () =>{
    if (label === "Password") {
      return value.replace(/./g, "*");
    } else {
      return value || "N/A";
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: "0.5rem",
      }}
    >
      <Typography variant="h6" fontWeight={"bold"}>
        {label}:
      </Typography>
      {edit ? (
        <TextField
          value={value}
          variant="standard"
          onChange={(e) => setValue(e.target.value)}
        />
      ) : (
        <Typography variant="h6">
          {valueToDisplay()}
        </Typography>
      )}
    </Box>
  );
};
