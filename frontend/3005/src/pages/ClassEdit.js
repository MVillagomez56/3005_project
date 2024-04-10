import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, TextField, Grid, Container, Typography } from "@mui/material";
import { ClassAvailability } from "../components/ClassAvailability";

export const ClassEdit = () => {
  const { courseid } = useParams();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();
  const [classData, setClassData] = useState({
    name: "",
    description: "",
    cost: "",
    capacity: "",
    start_time: "",
    end_time: "",
    day: "",
  }); // Use state to store fetched classData

  const canEdit = () => {
    if (
      (user.role === "trainer" || user.role === "admin") &&
      classData.type === "group"
    ) {
      return true;
    }
    if (user.role === "member" && classData.type === "personal") {
      return true;
    } else {
      return false;
    }
  };

  const isRegistered = async () => {
    if (user.role === "member") {
      const response = await fetch(
        `http://localhost:5000/api/classes/isRegistered/${user.id}/${courseid}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      const data = await response.json();
      console.log(data);
      return data.registered;
    }
  };

  useEffect(() => {
    if (user.role !== "admin") {
      //check if user is authorized to edit the class
      const checkRegistered = async () => {
        const _isRegistered = await isRegistered();
        if (!_isRegistered) {
          alert("You are not authorized to edit this class");
          navigate("/");
        }
      };
      checkRegistered();
    }
  }, [user.role, navigate]);

  const [response, setResponse] = useState(null);

  useEffect(() => {
    // Function to fetch classData data from the backend
    const fetchCourse = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/classes/getSpecificClass/${courseid}`
        );
        // Adjust the URL/port as per your setup
        const data = await response.json();
        setClassData(data); // Set fetched classData to state
        console.log(data);
      } catch (error) {
        console.error("Error fetching classData data:", error);
      }
    };

    if (courseid) {
      fetchCourse();
    }
  }, [courseid]); // Dependency array includes courseid to refetch if it changes

  // Check if classData data is not yet fetched
  if (!classData) {
    return <Typography>Loading...</Typography>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Field changed: ${name}, Value: ${value}`); // Debugging line
    setClassData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      //convert the int to HH:MM:SS format

      const newClassData = () => {
        if (
          classData.start_time === Infinity ||
          classData.end_time === -Infinity ||
          isNaN(classData.start_time) ||
          isNaN(classData.end_time)
        ) {
          return {
            name: classData.name,
            description: classData.description,
            cost: classData.cost,
            capacity: classData.capacity,
          };
        }
        return {
          name: classData.name,
          description: classData.description,
          cost: classData.cost,
          capacity: classData.capacity,
          start_time: `${String(classData.start_time).padStart(2, "0")}:00:00`,
          end_time: `${String(classData.end_time).padStart(2, "0")}:00:00`,
          day: classData.day,
        };
      };
      console.log("Saving class data:", classData);
      const response = await fetch(
        `http://localhost:5000/api/classes/updateClass/${courseid}`,
        {
          method: "POST", // Use POST or PUT as per your API design. PUT is more appropriate for updates.
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newClassData()),
        }
      );

      if (response.status === 200) {
        const updatedClass = await response.json();
        console.log("Class updated successfully:", updatedClass);
        setResponse("success");
        // Optionally, navigate to a different page or show a success message
      } else {
        console.error("Failed to update class.");
        setResponse("failed");
        // Handle failure, show error message to user
      }
    } catch (error) {
      console.error("Error saving class data:", error);
      // Handle error, show error message to user
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Edit Class Information
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Class Name"
            name="name"
            value={classData?.name || ""}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={classData.description}
            onChange={handleChange}
            multiline
            rows={4}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Cost"
            name="cost"
            disabled={user.role !== "admin"}
            type="number"
            value={classData.cost}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Capacity"
            name="capacity"
            type="number"
            disabled={user.role !== "admin" && classData.type !== "group"}
            value={classData.capacity}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <ClassAvailability classId={courseid} setNewTime={setClassData} />
        </Grid>
        {/* Additional fields can be added here */}
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Grid>
        <Grid item xs={12}>
          {response === "success" && (
            <Typography variant="body1" color="primary">
              Class updated successfully!
            </Typography>
          )}
          {response === "failed" && (
            <Typography variant="body1" color="error">
              Failed to update class. Please try again.
            </Typography>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};
