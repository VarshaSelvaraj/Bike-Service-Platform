import React from 'react';
import { Link } from 'react-router-dom';
import './Styles/Home.css';
import Navbar from './Navbar';

const Home = () => {
  return (
    <div className='home'>
      <Navbar />
      <div className="home-page">
        <div className="image-container">
          <div className="background-image-wrapper">
            <img
              src='homegif.gif'
              alt="Background"
              className="background-image"
            />
          </div>
        </div>
        <div className="overlay">
          <div className="content-box">
            <h1 className="welcome-text">Reliable Bike Services,<br/> Anytime, Anywhere!</h1>
            <p style={{ fontSize: "20px" }}>
              <i>"Discover nearby bike service stations and book appointments effortlessly. Own a bike service station? Register your details and attract customers. Manage bookings and services efficiently with our platform."</i>
            </p>
            <div className="button-container">
              <Link to="/login" className="btn">Explore BikeHub</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
