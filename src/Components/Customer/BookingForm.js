import React, { useState } from 'react';
import '../Styles/BookingForm.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const BookingForm = ({ station, onClose }) => {
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [date, setDate] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);
  const [status, setStatus] = useState('Pending');
  //function to handle service change adds services and send to the backend routes
   const handleServiceChange = (service) => {
    setSelectedServices((prevSelectedServices) =>
      prevSelectedServices.includes(service)
        ? prevSelectedServices.filter((s) => s !== service)
        : [...prevSelectedServices, service]
    );
  };
  //function called when form submits all details given in the booking form along with the current logged in userId is sent
  const handleSubmit = async (event) => {
    event.preventDefault();

    const bookingData = {
      userId: localStorage.getItem('userId'),
      stationId: station._id,
      stationName: station.stationName,
      customerName,
      email,
      phone,
      vehicleModel,
      vehicleNumber,
      date,
      services: selectedServices,
      status,
    };

    console.log('Submitting booking data:', bookingData);

    try {
      const response = await fetch('http://localhost:5000/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response from server:', errorData);
        throw new Error('Network response was not ok');
      }

      alert('Booking Successful');
      onClose();
    } catch (error) {
      console.error('Error submitting booking:', error);
    }
  };

  return (
    <div className="booking-backdrop">
      <div className="booking-modal">
        <div className="booking-image"></div>
        <div className="booking-form-container">
          <FontAwesomeIcon icon={faTimes} className="close-icon" onClick={onClose} />
          <h2>Booking for {station.stationName}</h2>
          <form className="booking-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="tel"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Vehicle Model"
              value={vehicleModel}
              onChange={(e) => setVehicleModel(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="TN 00 F 0000"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              required
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
            <p><b>Services required</b></p>
            <div className="services-checkboxes">
              {station.services.map((service) => (
                <div key={service} className="service-checkbox">
                  <input
                    type="checkbox"
                    value={service}
                    checked={selectedServices.includes(service)}
                    onChange={() => handleServiceChange(service)}
                  />
                  {service}
                </div>
              ))}
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
