import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard.tsx";
import { Profile } from "./pages/Profile.js";
import { Register } from "./pages/Register.js";
import { Login } from "./pages/Login.tsx";
import { Checkout } from "./pages/Checkout";
import { CourseDetail } from "./pages/CourseDetail";
import { RoomDetail } from "./pages/RoomDetail";
import { ClassEdit } from "./pages/ClassEdit";
import { PrivateRoute } from "./PrivateRoute";
import { Navbar } from "./components/Navbar.tsx";
import { Footer } from "./components/Footer.js";
import { MemberRegistration } from "./pages/MemberRegistration.js";
import Payment from "./pages/Payment.js";
import { useAuth } from "./store/AuthContext";
import { ErrorBoundary } from "react-error-boundary";
import RegisterComplete from "./pages/RegisterComplete.js";

export const AppRouter = () => {
  const { currentUser } = useAuth();
  console.log("current user", currentUser);
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/register/member" element={<PrivateRoute roleRequired={"member"}><MemberRegistration /></PrivateRoute>} />
        <Route path="/register/complete" element={<PrivateRoute ><RegisterComplete/></PrivateRoute>} />
        <Route
          path="/profile/:id"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/payment/:service/:amount"
          element={
            <PrivateRoute roleRequired={"member"}>
              <Payment />
            </PrivateRoute>
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/checkout"
          element={
            <PrivateRoute>
              <Checkout />
            </PrivateRoute>
          }
        />
        <Route path="/course/:courseid" element={<CourseDetail />} />
        <Route path="/room/:id" element={<RoomDetail />} />
        <Route
          path="/class/:id"
          element={
            <PrivateRoute component={ClassEdit} roleRequired="trainer" />
          }
        />
      </Routes>
      <Footer />
    </Router>
  );
};
