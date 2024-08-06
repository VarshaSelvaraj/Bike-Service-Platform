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

  const [errors, setErrors] = useState({});

  const handleServiceChange = (service) => {
    setSelectedServices((prevSelectedServices) =>
      prevSelectedServices.includes(service)
        ? prevSelectedServices.filter((s) => s !== service)
        : [...prevSelectedServices, service]
    );
  };

  const validateFields = () => {
    const newErrors = {};

    if (!customerName) newErrors.customerName = 'Customer name is required';
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email address is invalid';
    }
    if (!phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(phone)) {
      newErrors.phone = 'Phone number is invalid';
    }
    if (!vehicleModel) newErrors.vehicleModel = 'Vehicle model is required';
    if (!vehicleNumber) {
      newErrors.vehicleNumber = 'Vehicle number is required';
    } else if (!/^[A-Z]{2}\s?\d{2}\s?[A-Z]{1,2}\s?\d{4}$/.test(vehicleNumber)) {
      newErrors.vehicleNumber = 'Vehicle number is invalid';
    }
    if (!date) newErrors.date = 'Date is required';
    if (selectedServices.length === 0) newErrors.selectedServices = 'At least one service must be selected';

    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newErrors = validateFields();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

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

      alert(`Booking Successful Name: ${customerName} `);
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
            {errors.customerName && <p className="error">{errors.customerName}</p>}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {errors.email && <p className="error">{errors.email}</p>}
            <input
              type="tel"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            {errors.phone && <p className="error">{errors.phone}</p>}
            <input
              type="text"
              placeholder="Vehicle Model"
              value={vehicleModel}
              onChange={(e) => setVehicleModel(e.target.value)}
              required
            />
            {errors.vehicleModel && <p className="error">{errors.vehicleModel}</p>}
            <input
              type="text"
              placeholder="TN 00 F 0000"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              required
            />
            {errors.vehicleNumber && <p className="error">{errors.vehicleNumber}</p>}
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
            />
            {errors.date && <p className="error">{errors.date}</p>}
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
            {errors.selectedServices && <p className="error">{errors.selectedServices}</p>}
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
