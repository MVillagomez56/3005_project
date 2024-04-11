// FeaturedClassCard.js
import React from "react";
import {
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  Box,
  CardMedia,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import personal from "../assets/success_image.png";
import group from "../assets/group_class_image.jpg";
import { convertTime, dayOfWeek } from "../utils/time_converter";

const FeaturedClass = ({
  title,
  description,
  courseID,
  start_time,
  end_time,
  day,
  approval_status,
  type,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/courses/${courseID}`);
  };

  return (
    <Box>
      <Card
        sx={{
          maxWidth: 345,
          borderRadius: "10px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <CardMedia
          component="img"
          image={type === "personal" ? personal : group}
          alt={title}
          sx={{ height: "300px", objectFit: "cover" }} // Adjust image height and fit as needed
        />
        <CardContent>
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{ textAlign: "center" }}
          >
            {title} {!!approval_status ? "" : " - (Pending)"}
          </Typography>
          <Typography
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {description}
          </Typography>
          <Typography
            component={"div"}
            variant="body2"
            sx={{ textAlign: "center" }}
          >
            {convertTime(start_time)} - {convertTime(end_time)} on{" "}
            {dayOfWeek[day]}
          </Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: "center" }}>
          <Button size="small" onClick={handleClick}>
            Learn More
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};

export default FeaturedClass;
