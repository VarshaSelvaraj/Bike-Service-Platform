import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Styles/Login.css';
import Navbar from './Navbar';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '', userType: 'Bike Station Owner' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
 //handles usertype changes
  const handleUserTypeChange = (event) => {
    setFormData({ ...formData, userType: event.target.value });
  };

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

 //api to send login details to the backend routes to verify login
  const handleSubmit = (event) => {
    event.preventDefault();
    fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
      if (data.token) {
        console.log('Login successful:', data);

        //as soon as successful login storing userId and token in local storage
        localStorage.setItem('userId', data.userId); 
        localStorage.setItem('token', data.token);

        //set the fields to empty
        setFormData({ email: '', password: '', userType: 'Bike Station Owner' });
        alert('Login successful');
        
        //managing navigation after login
        if (formData.userType === 'Bike Station Owner') {
          navigate('/ownerdashboard');
        } else {
          navigate('/stationdisplay');
        }
      } else {
        setError(data.message);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      setError('Error logging in');
    });
  };

  return (
    <div>
      <Navbar/>
      <div className="login-page">
        <div className="login-container">
          <div className="login-content">
            <h2>Sign In</h2>
            <form className="login-form" onSubmit={handleSubmit}>
            <select value={formData.userType} onChange={handleUserTypeChange} className="user-type-dropdown" required>
                <option value="" disabled >Select Usertype</option>
                <option value="Bike Station Owner">Bike Station Owner - Manage bike stations</option>
                <option value="Customer">Customer - Book bike services</option>
              </select>
              <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
              <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
              <button type="submit" className="login-btn">Login</button>
              {error && <p className="error">{error}</p>}
              <p style={{fontSize:"15px"}}>Not registered yet? <a href="/signup">Create an account</a></p>
            </form>
          </div>
          <div className="login-image">
            <img src="https://cdni.iconscout.com/illustration/premium/thumb/indian-mechanic-standing-near-wheels-2660495-2227267.png" alt="Sign in " />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
