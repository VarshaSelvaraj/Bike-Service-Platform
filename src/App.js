import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Components/Login';
import './App.css';
import Home from './Components/Home';
import SignUp from './Components/SignUp';
import BikeStationRegistration from './Components/Owner/ServiceForm';
import BikeStationDisplay from './Components/StationDisplay';
import BookingForm from './Components/Customer/BookingForm';
import OwnerDashboard from './Components/Owner/DashBoard';
import CustomerProfile from './Components/Customer/Profile';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/bikestationregistration" element={<BikeStationRegistration />} />
          <Route path="/stationdisplay" element={<BikeStationDisplay />} />
          <Route path="/bookingform" element={<BookingForm />} />
          <Route path="/ownerdashboard" element={<OwnerDashboard />} />
          <Route path="/customerprofile" element={<CustomerProfile/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
