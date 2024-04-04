import React, { useState } from "react";
import { useAuth } from "../store/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Button from "@mui/material/Button";

export const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();
  const { logout, currentUser, isLoggedIn } = useAuth();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogOut = () => {
    logout();
    handleClose();
    setTimeout(() => {
      navigate("/");
    }, 50);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: "pink" }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Button
              color="inherit"
              sx={{
                fontSize: "2.5rem",
                textTransform: "none",
                fontWeight: "bold",
              }}
              onClick={() => navigate("/")}
            >
              MuhaMuhaGym
            </Button>
          </Typography>
          <Button color="inherit" onClick={() => navigate("/courses")}>
            Courses
          </Button>
          <Button color="inherit" onClick={() => navigate("/room")}>
            Room Booking
          </Button>
          {user.role === "member" && isLoggedIn && (
            <Button color="inherit" onClick={() => navigate("/checkout")}>
              Check Out
            </Button>
          )}

          {user.role === "admin" && isLoggedIn && (
            <Button color="inherit" onClick={() => navigate("/billing")}>
              Billing
            </Button>
          )}
          {isLoggedIn && (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem
                  onClick={() => {
                    handleClose();
                    navigate(`/profile/${currentUser?.id}`);
                  }}
                >
                  Profile
                </MenuItem>
                <MenuItem onClick={handleLogOut}>Logout</MenuItem>
              </Menu>
            </div>
          )}
          {!isLoggedIn && (
            <>
              <Button color="inherit" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button color="inherit" onClick={() => navigate("/register")}>
                Register
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};
