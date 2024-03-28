import React from 'react'
<<<<<<< HEAD
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



=======

export const CourseDetail = () => {
    return (
        <div>
        <h1>CourseDetail</h1>
        </div>
    )
    }
>>>>>>> 7d8605674b909fc582c7265d06ac77dc1647624b
