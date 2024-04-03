import React from "react";
import { Box } from "@mui/system";
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
    <Box>
      {featuredClasses.length>0 ? (
        featuredClasses.map((featuredClass) => (
          <FeaturedClass
            courseID={featuredClass.id}
            title={featuredClass.title}
            description={featuredClass.description}
          />
        ))
      ) : (
        <p>No featured classes available</p>
      )}
    </Box>
  );
};
