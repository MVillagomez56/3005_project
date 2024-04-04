import React from "react";
import { Box } from "@mui/system";
import { Grid } from '@mui/material';
import FeaturedClass from "./FeaturedClass";

export const FeaturedClasses = () => {
  const [featuredClasses, setFeaturedClasses] = React.useState([]);

  const fetchFeaturedClasses = async () => {
    const response = await fetch(
      "http://localhost:5000/api/classes/featuredClasses",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    if (!response) {
      return new Error("Failed to fetch featured classes");
    }
    if (response.status !== 200) {
      return new Error("Failed to fetch featured classes");
    }
    const data = await response.json();
    setFeaturedClasses(data);
  };

  React.useEffect(() => {
    fetchFeaturedClasses();
  }, []);
  console.log(featuredClasses);
  return (
    <Grid container spacing={1} justifyContent="center"> {/* Adjusted spacing and added justifyContent */}
      {featuredClasses.length > 0 ? (
        featuredClasses.map((featuredClass) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={featuredClass.id} sx={{ display: 'flex', justifyContent: 'center' }}> {/* Added sx prop for centering items */}
            <FeaturedClass
              courseID={featuredClass.id}
              title={featuredClass.name}
              description={featuredClass.description}
              start_time={featuredClass.start_time}
              end_time={featuredClass.end_time}
              day={featuredClass.day}
            />
          </Grid>
        ))
      ) : (
        <Grid item xs={12}>
          <p>No featured classes available</p>
        </Grid>
      )}
    </Grid>
  );

  
};
