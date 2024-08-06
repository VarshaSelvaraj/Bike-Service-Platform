import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaEdit, FaPlus, FaSave } from 'react-icons/fa'; 
import '../Styles/OwnerDashboard.css';

const OwnerDashboard = () => {
  const [ownerDetails, setOwnerDetails] = useState({});
  const [bikeStations, setBikeStations] = useState([]);
  const [editingService, setEditingService] = useState({ stationId: null, serviceIndex: null, serviceValue: '' });
  const [editingStatus, setEditingStatus] = useState({ bookingId: null, status: '' });
  const [activeSection, setActiveSection] = useState('profile'); 
  const navigate = useNavigate();

  const fetchBikeStations = async () => {
    try {
      //stores the logged in user's userId 
      const userId = localStorage.getItem('userId');
      //fetches bike station details using userId stored along with bike station registration
      const response = await fetch(`https://bike-service-platform.onrender.com/bikestations/user/${userId}`);
      const data = await response.json();

      const stationsWithBookings = await Promise.all(
        data.map(async (station) => {
          const bookingResponse = await fetch(`https://bike-service-platform.onrender.com/bookings/station/${station._id}`);
          const bookings = await bookingResponse.json();
          return { ...station, bookings };
        })
      );

      setBikeStations(stationsWithBookings);
    } catch (error) {
      console.error('Error fetching bike stations:', error);
    }
  };

  useEffect(() => {
    //fetches owner details using the userId
    const fetchOwnerDetails = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const response = await fetch(`https://bike-service-platform.onrender.com/user/${userId}`);
        const data = await response.json();
        setOwnerDetails(data);
      } catch (error) {
        console.error('Error fetching owner details:', error);
      }
    };

    fetchOwnerDetails();
    fetchBikeStations(); 
  }, []);

 //triggers when logout button is clicked, removes token, userId from localStorage
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };
 
//navigate to bikestation registration page
  const handleRegisterStation = () => {
    navigate('/bikestationregistration');
  };

  //api to handle when services are added, send new added services to the backend route
  const handleAddService = async (stationId, newService) => {
    try {
      const response = await fetch(`https://bike-service-platform.onrender.com/bikestation/addservice/${stationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newService }),
      });
      if (response.ok) {
        fetchBikeStations();
      } else {
        console.error('Failed to add service');
      }
    } catch (error) {
      console.error('Error adding service:', error);
    }
  };

  
  //api to handle when services are updated, send updated services to the backend route
  const handleEditService = async () => {
    const { stationId, serviceIndex, serviceValue } = editingService;
    try {
      const response = await fetch(`https://bike-service-platform.onrender.com/bikestation/editservice/${stationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ serviceIndex, updatedService: serviceValue }),
      });
      if (response.ok) {
        fetchBikeStations();
        setEditingService({ stationId: null, serviceIndex: null, serviceValue: '' }); 
      } else {
        console.error('Failed to edit service');
      }
    } catch (error) {
      console.error('Error editing service:', error);
    }
  };

  
  //api to handle when services are removed, sent removed services to the backend route
  const handleRemoveService = async (stationId, serviceIndex) => {
    try {
      const response = await fetch(`https://bike-service-platform.onrender.com/bikestation/removeservice/${stationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ serviceIndex }),
      });
      if (response.ok) {
        fetchBikeStations();
      } else {
        console.error('Failed to remove service');
      }
    } catch (error) {
      console.error('Error removing service:', error);
    }
  };

  //function to send the backend route the status changes
  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const response = await fetch(`https://bike-service-platform.onrender.com/bookings/status/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        fetchBikeStations(); 
        setEditingStatus({ bookingId: null, status: '' }); 
      } else {
        console.error('Failed to update booking status');
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="navbar-left">
          <img src="bikecare-icon.webp" alt="Logo" className="navbar-icon" />
          <span className="navbar-name">BikeHub</span>
        </div>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </header>
      <div className="dashboard-content">
        <aside className="sidebar">
          <ul>
          <li style={{fontSize:"20px",marginBottom:"10px"}}><b><i>{ownerDetails.fullName}'s</i> DashBoard</b></li>
            <li
              className={activeSection === 'profile' ? 'active' : ''}
              onClick={() => setActiveSection('profile')}
            >
              Profile
            </li>
            <li
              className={activeSection === 'bikeStations' ? 'active' : ''}
              onClick={() => setActiveSection('bikeStations')}
            >
              Bike Stations
            </li>
            <li
              className={activeSection === 'bookings' ? 'active' : ''}
              onClick={() => setActiveSection('bookings')}
            >
              Bookings
            </li>
          </ul>
        </aside>
        <main className="main-content">
          {activeSection === 'profile' && (
            <div className="card">
              <div className="owner-details">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTKStfX9sgtEzv2SpTQnkHKNsuxr9oiaiTot81geKYIQQEYSJ60-leaQkZ-OOw4wrexQo&usqp=CAU" 
                  alt="Owner"
                  className="owner-image"
                />
                <div>
                  <h2 style={{color:"#33567c"}}>Owner Details</h2>
                  <p><strong>Name:</strong> {ownerDetails.fullName}</p>
                  <p><strong>Email:</strong> {ownerDetails.email}</p>
                  <p><strong>Phone:</strong> {ownerDetails.phoneNumber}</p>
                  <p><strong>City:</strong> {ownerDetails.city}</p>
                </div>
              </div>
            </div>
          )}
          {activeSection === 'bikeStations' && (
            <>
              {bikeStations.map((station) => (
                <div className="card bike-station-card" key={station._id}>
                 
                  <h2 style={{color:"#33567c"}}><strong>{station.stationName}</strong></h2>
                  <p><strong>Location:</strong> {station.location}</p>
                  <p><strong>Address:</strong> {station.address}</p>
                  <p><strong>Services:</strong></p>
                  <div className="services-list">
                    {station.services.map((service, index) => (
                      <div className="service-item" key={index}>
                        {editingService.stationId === station._id && editingService.serviceIndex === index ? (
                          <input
                            type="text"
                            value={editingService.serviceValue}
                            onChange={(e) =>
                              setEditingService({ ...editingService, serviceValue: e.target.value })
                            }
                          />
                        ) : (
                          <span style={{marginRight:"15px"}}>{service}</span>
                        )}
                        <button onClick={() => setEditingService({ stationId: station._id, serviceIndex: index, serviceValue: service })} style={{marginRight:"15px"}}>
                          <FaEdit />
                        </button>
                        <button onClick={() => handleRemoveService(station._id, index)}>
                          <FaTrash />
                        </button>
                        {editingService.stationId === station._id && editingService.serviceIndex === index && (
                          <button onClick={handleEditService}>
                            <FaSave />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="add-service-form">
                    <input
                      type="text"
                      
                      value={editingService.stationId === station._id ? editingService.serviceValue : ''}
                      onChange={(e) =>
                        setEditingService({ stationId: station._id, serviceIndex: null, serviceValue: e.target.value })
                      }
                      placeholder="Add new service"
                    />
                    <button onClick={() => handleAddService(station._id, editingService.serviceValue)} style={{backgroundColor:"#33567c"}}>
                      <FaPlus /> Add Service
                    </button>
                  </div>
                </div>
              ))}
              <button className="bk-btn" onClick={handleRegisterStation}>Register New Bike Station</button>
            </>
          )}
          {activeSection === 'bookings' && (
            <div className="card">
              <h2 style={{color:"#33567c"}}>All Bookings</h2>
              <table>
                <thead>
                  <tr>
                    <th>Station</th>
                    <th>User</th>
                    <th>Service</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bikeStations.flatMap((station) => 
                    station.bookings.map((booking) => (
                      <tr key={booking._id}>
                        <td>{station.stationName}</td>
                        <td>{booking.customerName}</td>
                        <td>{booking.services}</td>
                        <td>{new Date(booking.date).toLocaleDateString()}</td>
                        <td>
                            {editingStatus.bookingId === booking._id ? (
                              <select className='statusselect'
                                value={editingStatus.status}
                                onChange={(e) => setEditingStatus({ ...editingStatus, status: e.target.value })}
                              >
                                <option value="Pending" style={{color:"orange"}}>Pending</option>
                                <option value="Ready" style={{color:"Green"}}>Ready for Delivery</option>
                                <option value="Completed" style={{color:"blue"}}>Completed </option>
                              </select>
                            ) : (
                              booking.status
                            )}
                          </td>
                          <td>
                            {editingStatus.bookingId === booking._id ? (
                              <button onClick={() => handleStatusChange(booking._id, editingStatus.status)} className="save-status">
                                <FaSave className="icon" /> 
                              </button>
                            ) : (
                              <button onClick={() => setEditingStatus({ bookingId: booking._id, status: booking.status })} className="edit-status">
                                <FaEdit className="icon" /> 
                              </button>
                            )}
                          </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default OwnerDashboard;
