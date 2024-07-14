import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Styles/SignUp.css';
import Navbar from './Navbar';

const SignUp = () => {
  const navigate= useNavigate();
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
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    fetch('http://localhost:5000/signup', {
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
       <Navbar/>
       <div className="signup-page">
         <div className="signup-container">
           <img className="signup-image" src="https://cdni.iconscout.com/illustration/premium/thumb/indian-mechanic-repairing-wheel-with-wrench-2660497-2227268.png" alt="Signup" />
           <div className="signup-form-container">
             <h2>Signup</h2>
             <form className="signup-form" onSubmit={handleSubmit}>
               <div className="signup-form-column">
                 <input type="text" name="fullName" placeholder="Full Name" style={{padding:"12px", width:"172px"}} value={formData.fullName} onChange={handleChange} required />
                 <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                 <input type="tel" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} required />
                 <select name="userType" value={formData.userType} onChange={handleUserTypeChange} required>
                 <option value="Bike Station Owner">Bike Station Owner - Manage bike stations</option>
                 <option value="Customer">Customer - Book bike services</option>
                 </select>
               </div>
               <div className="signup-form-column">
                 <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                 <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />
                 <input type="text" name="city" placeholder="City" style={{padding:"12px", width:"172px"}} value={formData.city} onChange={handleChange} required />
                 <input type="number" name="pinCode" placeholder="Pin code" value={formData.pinCode} onChange={handleChange} required />
               </div>
               <button type="submit" className="signup-btn">Signup</button>
               <p style={{fontSize:"15px"}}>Already have an account? <a href="/login">Login</a></p>
             </form>
           </div>
         </div>
       </div>
     </div>
  );
};

export default SignUp;
