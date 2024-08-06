import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/serviceform.css'; 

const BikeStationRegistration = () => {
  const [stationName, setStationName] = useState('');
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [description, setDescription] = useState(''); 
  const [services, setServices] = useState({
    GeneralService: false,
    OilChange: false,
    WaterWash: false,
    Polishing: false,
    RepairServices: false,
    TeflonCoating: false,
  });
  const navigate = useNavigate();
 
  //api to handle service changes
  const handleServiceChange = (event) => {
    const { name, checked } = event.target;
    setServices((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  //api that handles submission and sends the form data to the backend routes
  const handleSubmit = async (event) => {
    event.preventDefault();
    const selectedServices = Object.keys(services).filter((service) => services[service]);
    const formData = {
      stationName,
      location,
      address,
      contactPerson,
      contactNumber,
      description,
      services: selectedServices,
      userId: localStorage.getItem('userId'), 
    };

    try {
      const response = await fetch('https://bike-service-platform.onrender.com/bikestation/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || 'Network response was not ok');
      }
      //set all the fields empty on successfull submission
      setStationName('');
      setLocation('');
      setAddress('');
      setContactPerson('');
      setContactNumber('');
      setDescription('');
      setServices({
        GeneralService: false,
        OilChange: false,
        WaterWash: false,
        Polishing: false,
        RepairServices: false,
        TeflonCoating: false,
      });
      navigate('/ownerdashboard');
      alert('Bike station registered successfully!');
    } catch (error) {
      console.error('Error registering bike station:', error);
      alert('Failed to register bike station. Please try again.');
    }
  };

  return (
    <div className="registration-page">
      <div className="registration-container">
        <div className="registration-image"></div>
        <div className="registration-form-container">
          <h3>Register Bike Station</h3>
          <form className="registration-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Station Name"
              value={stationName}
              onChange={(e) => setStationName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Contact Person Name"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Contact Number"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              required
            />
            <textarea
              placeholder="Bike Station Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <h4>Services Offered</h4>
            <div className="services">
              <div className="chk">
                <label>
                  <input
                    type="checkbox"
                    name="GeneralService"
                    checked={services.GeneralService}
                    onChange={handleServiceChange}
                  />
                  General Service Check-up
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="OilChange"
                    checked={services.OilChange}
                    onChange={handleServiceChange}
                  />
                  Oil Change
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="WaterWash"
                    checked={services.WaterWash}
                    onChange={handleServiceChange}
                  />
                  Water Wash
                </label>
              </div>
              <div className="services-column">
                <label>
                  <input
                    type="checkbox"
                    name="Polishing"
                    checked={services.Polishing}
                    onChange={handleServiceChange}
                  />
                  Polishing
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="RepairServices"
                    checked={services.RepairServices}
                    onChange={handleServiceChange}
                  />
                  Repair Services
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="TeflonCoating"
                    checked={services.TeflonCoating}
                    onChange={handleServiceChange}
                  />
                  Teflon Coating
                </label>
              </div>
            </div>
            <button type="submit" className="registration-btn">
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BikeStationRegistration;
