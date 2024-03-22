import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {Dashboard} from './pages/Dashboard';
import {Profile} from './pages/Profile.js';
import {Register} from './pages/Register';
import {Login} from './pages/Login';
import {Checkout} from './pages/Checkout';
import {CourseDetail} from './pages/CourseDetail';
import {RoomDetail} from './pages/RoomDetail';
import {ClassEdit} from './pages/ClassEdit';
import {PrivateRoute} from './PrivateRoute';


export const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} /> 
        <Route path="/profile/:id" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
        <Route path="/course/:courseid" element={<CourseDetail />} />
        <Route path="/room/:id" element={<RoomDetail />} />
        <Route path="/class/:id" element={<PrivateRoute component={ClassEdit} roleRequired="trainer" />} />
      </Routes>
    </Router>
  );
  }
