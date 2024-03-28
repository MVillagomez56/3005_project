import React from 'react'
import { Box, Grid} from '@mui/material'
import Banner from '../components/Banner'
import FeaturedClass from '../components/FeaturedClass';


// temporary data for testing, should be deleted once database data is being implemented 
const courseworks = [
  { Id: 1, title: 'Introduction to Computer Science', description: 'An introductory course to the fundamentals of computer science.',imageURL: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.123rf.com%2Fstock-photo%2Fpreview.html%3Fpage%3D7&psig=AOvVaw3eg1pqQhGbRFwspgJzZ3Ix&ust=1711594645665000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCNjGkIm5k4UDFQAAAAAdAAAAABAJ" },
  { Id:2, title: 'Web Development', description: 'Learn the basics of web development, from HTML to advanced JavaScript.' , imageURL: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.123rf.com%2Fstock-photo%2Fpreview.html%3Fpage%3D7&psig=AOvVaw3eg1pqQhGbRFwspgJzZ3Ix&ust=1711594645665000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCNjGkIm5k4UDFQAAAAAdAAAAABAJ"},
  { Id:3,title: 'Database Systems', description: 'Understand the underlying systems of databases and how to interact with them.' ,imageURL: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.123rf.com%2Fstock-photo%2Fpreview.html%3Fpage%3D7&psig=AOvVaw3eg1pqQhGbRFwspgJzZ3Ix&ust=1711594645665000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCNjGkIm5k4UDFQAAAAAdAAAAABAJ"},
];



export const Dashboard = () => {
    return (
        <div>
        <Box>
          <Banner />
        </Box>
        <div style={{margin:60}}>
        <Grid container spacing={3}>
          {courseworks.map((coursework, index) => (
            <FeaturedClass key={index} title={coursework.title} description={coursework.description} imageUrl={coursework.imageURL} courseID={coursework.Id}/>
          ))}
        </Grid>
        </div>
        </div>
    )
 }