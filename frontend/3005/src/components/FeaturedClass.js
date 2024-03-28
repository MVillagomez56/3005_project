// FeaturedClassCard.js
import React from 'react';
import { Card, CardActions, CardContent, Button, Typography, Grid, CardMedia } from '@mui/material';
import { useNavigate } from "react-router-dom";

const FeaturedClass = ({ title, description,imageUrl,courseID}) => {
    const navigate = useNavigate();

    const handleClick = () =>{
        navigate(`/courses/${courseID}`)
    }


    return (
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <CardMedia
              component="img"
              image={imageUrl}
              alt={title}
              sx={{ height: '140px', objectFit: 'cover' }} // Adjust image height and fit as needed
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div" sx={{ textAlign: 'center' }}>
                {title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                {description}
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center' }}>
              <Button size="small" onClick={handleClick}>Learn More</Button>
            </CardActions>
          </Card>
        </Grid>
      );
};

export default FeaturedClass;
