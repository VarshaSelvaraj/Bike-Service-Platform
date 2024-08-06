import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Styles/Navbar.css';

const Navbar = () => {
  const [userName, setUserName] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false); // Add this line
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  
  useEffect(() => {
    //to display username of the logged in user fetching userId from local storage
    const loggedInUserId = localStorage.getItem('userId');
    if (!loggedInUserId) {
      console.error('User ID not found in localStorage');
      return;
    }

    fetchUserProfile(loggedInUserId);
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  //api to fetch userdetails with userId
  const fetchUserProfile = async (userId) => {
    try {
      const response = await fetch(`https://bike-service-platform.onrender.com/user/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const userData = await response.json();
      setUserName(userData.fullName); 
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

//on logout remove userId from local storage
  const handleLogout = () => {
    localStorage.removeItem('userId');
    setUserName('');
    navigate('/home');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src="bikecare-icon.webp" alt="Logo" className="navbar-icon" />
        <span className="navbar-name">BikeHub</span>
      </div>
      <div className="navbar-right">
        <ul className="navbar-links">
          {!userName && <li><Link to="/home"><i className="fas fa-home"></i>Home</Link></li>}
          {userName ? (
            <>
              <li><Link to="/stationdisplay"><i className="fas fa-bicycle"></i>Browse Service Stations</Link></li>
              <li className="profile-link" ref={dropdownRef}>
                <div className="dropbtn" onClick={() => setDropdownVisible(!dropdownVisible)}>
                  <i className="fas fa-user" style={{marginRight:"5px"}}></i>{userName}
                </div>
                {dropdownVisible && (
                  <div className="dropdown-content">
                    <Link to="/customerprofile" style={{fontSize:"14px"}}>View Booking</Link>
                    <Link to="/home" style={{fontSize:"14px"}} onClick={handleLogout}>Logout</Link>
                  </div>
                )}
              </li>
            </>
          ) : (
            <li><Link to="/login"><i className="fas fa-sign-in-alt"></i>Login</Link></li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
