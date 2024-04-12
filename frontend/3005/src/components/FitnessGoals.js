import React, { useEffect, useCallback } from "react";
import { Box } from "@mui/system";
import {
  ListItem,
  Button,
  TextField,
  ListItemText,
  Checkbox,
  IconButton,
  Typography,
  Card
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditRounded from "@mui/icons-material/EditRounded";

export const FitnessGoals = ({ currentUser }) => {
  const [fitnessGoals, setFitnessGoals] = React.useState([]);

  const [newGoal, setNewGoal] = React.useState("");
  const fetchFitnessGoals = useCallback(async () => {
    const response = await fetch(
      `http://localhost:5000/api/fitnessGoals/${currentUser.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    if (!response) {
      return new Error("Failed to fetch fitness goals");
    }

    if (response.status !== 200) {
      return new Error("Failed to fetch fitness goals");
    }

    const data = await response.json();
    setFitnessGoals(data);
    console.log(data);
  }, [currentUser.id]);

  const deleteFitnessGoal = async (id) => {
    const response = await fetch(
      `http://localhost:5000/api/deleteFitnessGoal/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    if (response.status !== 200) {
      return new Error("Failed to delete fitness goal");
    }

    fetchFitnessGoals();
  };

  const completeFitnessGoal = async (id, status) => {
    const response = await fetch(
      `http://localhost:5000/api/completeFitnessGoal/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },

        body: JSON.stringify({ status: status }),
      }
    );

    if (response.status !== 200) {
      return new Error("Failed to complete fitness goal");
    }

    fetchFitnessGoals();
  };

  const updateFitnessGoal = async (id, goal) => {
    const response = await fetch(
      `http://localhost:5000/api/updateFitnessGoal/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ goal }),
      }
    );

    if (response.status !== 200) {
      return new Error("Failed to update fitness goal");
    }

    fetchFitnessGoals();
  };

  const addFitnessGoal = async (goal) => {
    const response = await fetch(
      `http://localhost:5000/api/addFitnessGoal/${currentUser.id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ goal }),
      }
    );

    if (response.status !== 201) {
      return new Error("Failed to add fitness goal");
    }
    fetchFitnessGoals();
  };

  useEffect(() => {
    fetchFitnessGoals();
  }, [fetchFitnessGoals]);

  const handleAddGoal = (goal) => {
    addFitnessGoal(goal);
    setNewGoal("");
  };
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        padding: "3rem",
        borderRadius: "10px",
      }}
    >
      <Typography variant="h4">Fitness Goals!</Typography>

      {!fitnessGoals?.length ? (
        <Typography variant="h6">No fitness goals set</Typography>
      ) : (
        fitnessGoals.map((goal, index) => (
          <ListItem
            secondaryAction={ JSON.parse(localStorage.getItem("user")).id === currentUser.id &&
              <>
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() => {
                    const newGoal = prompt("Enter new goal", goal.goal);
                    updateFitnessGoal(goal.id, newGoal);
                  }}
                >
                  <EditRounded />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => deleteFitnessGoal(goal.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </>
            }
            disablePadding
          >
            <Checkbox
              edge="start"
              checked={goal.status}
              tabIndex={-1}
              disableRipple
              disabled={JSON.parse(localStorage.getItem("user")).id !== currentUser.id}
              inputProps={{
                "aria-labelledby": `checkbox-list-label-${goal.id}`,
              }}
              onChange={() => {
                const newStatus = !goal.status;
                const updatedGoal = { ...goal, status: !goal.status };
                const updatedGoals = [...fitnessGoals];
                updatedGoals[index] = updatedGoal;
                setFitnessGoals(updatedGoals);
                completeFitnessGoal(goal.id, newStatus);
              }}
            />
            <ListItemText
              id={`checkbox-list-label-${goal.id}`}
              primary={goal.goal}
            />
          </ListItem>
        ))
      )}

      { JSON.parse(localStorage.getItem("user")).id === currentUser.id && 
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <TextField
            label="Add Goal"
            variant="outlined"
            size="small"
            onChange={(e) => setNewGoal(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleAddGoal(newGoal)}
          >
            Add
          </Button>
        </Box>
      }
    </Card>
  );
};
