import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {Dashboard} from './pages/Dashboard.tsx';
import {Profile} from './pages/Profile.js';
import {Register} from './pages/Register.js';
import {Login} from './pages/Login.tsx';
import {Checkout} from './pages/Checkout';
import {CourseDetail} from './pages/CourseDetail';
import {RoomDetail} from './pages/RoomDetail';
import {ClassEdit} from './pages/ClassEdit';
import {PrivateRoute} from './PrivateRoute';
import {Navbar} from "./components/Navbar.tsx";
import {Footer} from './components/Footer.js';
import {Course} from "./pages/Course.js";
import {Room} from "./pages/Room.js";
import {Billing} from './pages/Billing.js';
import { MemberSearch } from './pages/MemberSearch.js';
import { TrainersPage } from './pages/TrainersPage.js';
import { MemberRegistration } from './pages/MemberRegistration.js';
import { Payment } from './pages/Payment.js';


export const AppRouter = () => {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Dashboard />} /> 
        <Route path="/profile/:id" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/register/member" element={<MemberRegistration />} /> 
        <Route path="/payment/:service/:amount" element={<PrivateRoute><Payment /></PrivateRoute>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
        <Route path="/courses" element={<Course/>} />
        <Route path="/courses/:courseid" element={<CourseDetail />} />
        <Route path="/room" element ={<Room/>} />
        <Route path="/room/:id" element={<RoomDetail />} />
        <Route path="/class/:id" element={<PrivateRoute component={ClassEdit} roleRequired="trainer" />} />
        <Route path="/billing" element={<Billing/>} />
        <Route path="/searchMember" element={<MemberSearch />} /> 
        <Route path="/trainers" element={<TrainersPage />} />
      </Routes>
      <Footer/>
    </Router>
  );
  }
