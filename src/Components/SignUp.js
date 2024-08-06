import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Styles/SignUp.css';
import Navbar from './Navbar';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    userType: 'Bike Station Owner',
    password: '',
    confirmPassword: '',
    city: '',
    pinCode: ''
  });
  const [errors, setErrors] = useState({});

  const initialFormData = {
    fullName: '',
    email: '',
    phoneNumber: '',
    userType: 'Bike Station Owner',
    password: '',
    confirmPassword: '',
    city: '',
    pinCode: ''
  };

  const handleUserTypeChange = (event) => {
    setFormData({ ...formData, userType: event.target.value });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({ ...formData, [name]: value });
  };

  const validateInputs = () => {
    const newErrors = {};

    // Validate fullName for alphabets only
    if (!/^[A-Za-z\s]+$/.test(formData.fullName)) {
      newErrors.fullName = 'Full Name should contain only alphabets';
    }

    // Validate email format
    const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailPattern.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    // Validate phone number format
    const phonePattern = /^\d{10}$/;
    if (!phonePattern.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone Number should contain exactly 10 digits';
    }

    // Validate password (at least 8 characters, at least one letter and one number)
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordPattern.test(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters long and contain at least one letter and one number';
    }

    // Validate city for alphabets only
    if (!/^[A-Za-z\s]+$/.test(formData.city)) {
      newErrors.city = 'City should contain only alphabets';
    }

    // Validate pin code format
    const pinPattern = /^\d{6}$/;
    if (!pinPattern.test(formData.pinCode)) {
      newErrors.pinCode = 'Pin Code should contain exactly 6 digits';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateInputs()) {
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Posting the signup details to the backend routes
    fetch('https://bike-service-platform.onrender.com/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(response => response.json())
      .then(data => {
        if (data.token) {
          console.log('Success:', data);
          localStorage.setItem('token', data.token);
          alert('User registered successfully');
          navigate('/login');
          setFormData(initialFormData);
        } else {
          alert('Error registering user: ' + data.message);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('Error registering user');
      });
  };

  return (
    <div>
      <Navbar />
      <div className="signup-page">
        <div className="signup-container">
          <img className="signup-image" src="https://cdni.iconscout.com/illustration/premium/thumb/indian-mechanic-repairing-wheel-with-wrench-2660497-2227268.png" alt="Signup" />
          <div className="signup-form-container">
            <h2>Signup</h2>
            <form className="signup-form" onSubmit={handleSubmit}>
              <div className="signup-form-column">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  style={{ padding: "12px", width: "172px" }}
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
                {errors.fullName && <span className="error">{errors.fullName}</span>}
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {errors.email && <span className="error">{errors.email}</span>}
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="Phone Number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                />
                {errors.phoneNumber && <span className="error">{errors.phoneNumber}</span>}
                <select name="userType" value={formData.userType} onChange={handleUserTypeChange} required>
                  <option value="Bike Station Owner">Bike Station Owner - Manage bike stations</option>
                  <option value="Customer">Customer - Book bike services</option>
                </select>
              </div>
              <div className="signup-form-column">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                {errors.password && <span className="error">{errors.password}</span>}
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  style={{ padding: "12px", width: "172px" }}
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
                {errors.city && <span className="error">{errors.city}</span>}
                <input
                  type="number"
                  name="pinCode"
                  placeholder="Pin code"
                  value={formData.pinCode}
                  onChange={handleChange}
                  required
                />
                {errors.pinCode && <span className="error">{errors.pinCode}</span>}
              </div>
              <button type="submit" className="signup-btn">Signup</button>
              <p style={{ fontSize: "15px" }}>Already have an account? <a href="/login">Login</a></p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
