import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TrainerRoomAvailability } from "../components/TrainerRoomAvailability";
import {
  Container,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  TextField,
  Box, // Import Box for layout and spacing
} from "@mui/material";

function generateHourTimes() {
  const times = [];
  for (let i = 0; i < 24; i++) {
    const hour = i.toString().padStart(2, "0");
    times.push(`${hour}:00`);
  }
  return times;
}

export const PersonalSessionDetail = () => {
  const { id } = useParams(); // Assuming this is the trainer ID
  const [trainer, setTrainer] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [showAvailability, setShowAvailability] = useState(false);
  const [startTimeOptions, setStartTimeOptions] = useState(generateHourTimes());
  const [endTimeOptions, setEndTimeOptions] = useState(generateHourTimes());
  const [classDetails, setClassDetails] = useState({
    trainerId: id,
    roomId: "",
    startTime: "",
    endTime: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedDay, setSelectedDay] = useState("");

  // Fetch trainer details
  useEffect(() => {
    const fetchTrainerDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/trainer/${id}`);
        if (!response.ok) {
          throw new Error("Could not fetch trainer details.");
        }
        const data = await response.json();
        setTrainer(data);
      } catch (error) {
        console.error("Error fetching trainer details:", error);
        setError(error.message);
      }
    };

    fetchTrainerDetails();
  }, [id]);

  // Fetch rooms
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/rooms");
        if (!response.ok) {
          throw new Error("Could not fetch rooms.");
        }
        const data = await response.json();
        setRooms(data);
      } catch (error) {
        console.error("Error fetching rooms:", error);
        setError(error.message);
      }
    };

    fetchRooms();
  }, []);

  

  const handleDayChange = (event) => {
    const day = event.target.value; // Assuming the day comes from an input or select field
    setSelectedDay(day);
    setClassDetails((prevDetails) => ({ ...prevDetails, day })); // Update classDetails state
  };

  const handleRoomChange = (event) => {
    setSelectedRoomId(event.target.value);
    setClassDetails({ ...classDetails, roomId: event.target.value });
  };

  const handleSearchAvailability = () => {
    setShowAvailability(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setClassDetails({ ...classDetails, [name]: value });
  };

  // Example function within your component for handling the form submission
  const handleSubmit = async () => {
    // Access startTime and endTime from classDetails state

    const trainerIdInt = parseInt(id, 10);
    const { startTime, endTime, roomId } = classDetails;

    // Calculation for duration needs to consider minutes as well to be more accurate
    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);
    const duration = (end - start) / (1000 * 60 * 60); // Convert difference from milliseconds to hours

    // Assuming you'll adjust your state to include trainer's cost and handle selectedDay
    const cost = duration * trainer.cost; // Make sure trainer state includes cost
    const description = `Personal session with ${trainer.name}`;

    // Use ...classDetails to maintain existing state values and override specific ones
    const sessionDetails = {
      name: "Personal session",
      description,
      trainer_id: trainerIdInt,
      start_time: startTime,
      end_time: endTime,
      day: classDetails.day,
      cost,
      capacity: 1,
      type: "personal",
      room_id: roomId, // Assuming roomId is correctly updated in classDetails
      approval_status: false,
    };

    console.log("Submitting class session details:", sessionDetails);

    // Send POST request to your backend to create the class
    try {
      const response = await fetch("http://localhost:5000/api/classes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sessionDetails),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Handle success here
      setSuccessMessage("Class successfully created");
      console.log("Class successfully created");
    } catch (error) {
      console.error("Error creating class:", error);
      setError(error.message); // Update error state to display the message
    }
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: "2rem" }}>
      <Paper elevation={3} sx={{ padding: "2rem", textAlign: "center" }}>
        {error && <Typography color="error">{error}</Typography>}
        
        {trainer ? (
          <>
            <Typography variant="h4" gutterBottom>
              {trainer.name}
            </Typography>
            <Typography variant="h5" gutterBottom>
              ${trainer.cost} /hr
            </Typography>
          </>
        ) : (
          <Typography>Loading...</Typography>
        )}
        <Box mt={4}>
          <Typography
            variant="h6"
            gutterBottom
            component="div"
            sx={{ fontWeight: "bold" }}
          >
            Register a personal session
          </Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="room-select-label">Select a Room</InputLabel>
            <Select
              labelId="room-select-label"
              id="room-select"
              value={selectedRoomId}
              label="Select a Room"
              onChange={handleRoomChange}
            >
              {rooms.map((room) => (
                <MenuItem key={room.id} value={room.id}>
                  {room.name} - {room.description}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            onClick={handleSearchAvailability}
            variant="outlined"
            sx={{ mb: 2 }}
          >
            Check Trainer and Room Availability
          </Button>
        </Box>
        {showAvailability && (
          <TrainerRoomAvailability trainerId={id} roomId={selectedRoomId} />
        )}
        <Box mt={4}>
          <FormControl fullWidth>
            <InputLabel id="day-select-label">Day</InputLabel>
            <Select
              labelId="day-select-label"
              id="day-select"
              value={selectedDay}
              label="Day"
              onChange={handleDayChange}
            >
              {/* Assuming you have a predefined list of days */}
              <MenuItem value={1}>Monday</MenuItem>
              <MenuItem value={2}>Tuesday</MenuItem>
              <MenuItem value={3}>Wednesday</MenuItem>
              {/* Add more days as needed */}
            </Select>
          </FormControl>
          {/* Time selection fields */}
          <FormControl fullWidth margin="normal">
            <InputLabel id="start-time-select-label">Start Time</InputLabel>
            <Select
              labelId="start-time-select-label"
              id="start-time-select"
              value={classDetails.startTime}
              onChange={(e) =>
                handleChange({
                  target: { name: "startTime", value: e.target.value },
                })
              }
              required
            >
              {generateHourTimes().map((time) => (
                <MenuItem key={time} value={time}>
                  {time}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel id="end-time-select-label">End Time</InputLabel>
            <Select
              labelId="end-time-select-label"
              id="end-time-select"
              value={classDetails.endTime}
              onChange={(e) =>
                handleChange({
                  target: { name: "endTime", value: e.target.value },
                })
              }
              required
            >
              {generateHourTimes().map((time) => (
                <MenuItem key={time} value={time}>
                  {time}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Submit Session
          </Button>
        </Box>

        {successMessage && (
          <Typography color="success">{successMessage}</Typography>
        )}
      </Paper>
    </Container>
  );
};
