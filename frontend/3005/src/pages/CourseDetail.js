import React from 'react'
import { useParams } from 'react-router-dom';

export const CourseDetail = () => {
  // Use the fetch single course, based on the id on the url... 


  // We will pass this id to the backend for getting the specific course
  const params = useParams();

  const courseid = params.courseid;


  return (
    <div>
      <h2>Course Details</h2>
      <p>Showing details for course ID: {courseid}</p>
    </div>
  );
}



