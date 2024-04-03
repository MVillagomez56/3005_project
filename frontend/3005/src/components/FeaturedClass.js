// FeaturedClassCard.js
import React from "react";
import {
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  Grid,
  CardMedia,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import image from "../assets/success_image.png";

const FeaturedClass = ({ title, description, courseID }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/courses/${courseID}`);
  };

  return (
    <Grid item xs={18} sm={20} md={20}>
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <CardMedia
          component="img"
          image={image}
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
            {title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ flexGrow: 1 }}
          >
            {description}
          </Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: "center" }}>
          <Button size="small" onClick={handleClick}>
            Learn More
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default FeaturedClass;
