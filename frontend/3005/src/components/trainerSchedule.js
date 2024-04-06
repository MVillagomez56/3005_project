import React, { useState, useEffect} from 'react';
import {
    Container, Typography, Button, TextField, Dialog, DialogActions,
    DialogContent, DialogTitle, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, Grid, Box, useTheme
  } from '@mui/material';
// Expanded Sample Data


export const TrainerSchedule = () => {
    const [workingHours, setWorkingHours] = useState({});
    const [classSchedule, setClassSchedule] = useState([]);
    const [editDay, setEditDay] = useState(null);
    const [newEndTime, setNewEndTime] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const currentUser = JSON.parse(localStorage.getItem("user"));
    
    useEffect(() => {
      fetchWorkingHours();
      fetchClassSchedule();
    }, []);
  
    const fetchWorkingHours = async () => {
      try {
        const response = await fetch(`/api/getTrainerSchedule/${currentUser.id}`);
        if (!response.ok) throw new Error('Failed to fetch working hours.');
        const data = await response.json();
        const formattedHours = data.reduce((acc, curr) => {
          acc[curr.day] = { start: curr.start_time, end: curr.end_time };
          return acc;
        }, {});
        setWorkingHours(formattedHours);
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
    const fetchClassSchedule = async () => {
      try {
        const response = await fetch(`/api/getTrainerCourses/${currentUser.id}`);
        if (!response.ok) throw new Error('Failed to fetch class schedule.');
        const data = await response.json();
        setClassSchedule(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
    const updateWorkingHours = async () => {
      try {
        const response = await fetch(`/api/updateTrainerSchedule/${currentUser.id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            day: editDay,
            start_time: workingHours[editDay].start, // Assuming start time remains the same
            end_time: newEndTime,
          }),
        });
        if (!response.ok) throw new Error('Failed to update working hours.');
        alert('Working hours updated successfully.');
        fetchWorkingHours();
      } catch (error) {
        console.error('Error:', error);
        alert('Failed to update working hours.');
      }
      handleCloseEditDialog();
    };
  
    const handleOpenEditDialog = (day) => {
        setEditDay(day);
        setOpenDialog(true);
        setNewEndTime(workingHours[day]?.end || '');
      };

    const handleCloseEditDialog = () => {
        setOpenDialog(false);
      };

      
    
  const daysMap = {1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday', 5: 'Friday', 6: 'Saturday', 7: 'Sunday'};
  const theme = useTheme();

  return (
    <Container maxWidth="md" sx={{ pt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Trainer Schedule
      </Typography>
  
      {/* Enhanced Display for Working Hours with Cards */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h6" gutterBottom>
          Working Hours
        </Typography>
        <Grid container spacing={3}>
          {Object.entries(workingHours).sort().map(([day, hours]) => (
            <Grid item xs={12} sm={6} md={4} key={day}>
              <Paper elevation={3} sx={{ padding: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Typography variant="h6">{daysMap[day]}: {hours.start} - {hours.end}</Typography>
                <Button variant="contained" onClick={() => handleOpenEditDialog(day)} color="primary">
                  Edit
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
  
      {/* Class Schedule Table with Enhanced Styling */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h6" gutterBottom>
          Class Schedule
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Day</TableCell>
                <TableCell>Class Name</TableCell>
                <TableCell>Start Time</TableCell>
                <TableCell>End Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {classSchedule.map((cls, index) => (
                <TableRow key={index}>
                  <TableCell>{daysMap[cls.day]}</TableCell>
                  <TableCell>{cls.className}</TableCell>
                  <TableCell>{cls.startTime}</TableCell>
                  <TableCell>{cls.endTime}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
  
      {/* Dialog for editing working hours */}
      <Dialog open={Boolean(editDay)} onClose={handleCloseEditDialog}>
        <DialogTitle>Edit Working Hours for {daysMap[editDay]}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="end-time"
            label="New End Time"
            type="time"
            fullWidth
            variant="outlined"
            value={newEndTime}
            onChange={(e) => setNewEndTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button onClick={updateWorkingHours} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};