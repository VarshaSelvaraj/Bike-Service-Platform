import React, { useEffect, useState } from 'react';
import '../Styles/CustomerProfile.css';
import Navbar from '../Navbar';

const CustomerProfile = () => {
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileAndBookings = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          setError('User ID not found in localStorage');
          setLoading(false);
          return;
        }
        const profileResponse = await fetch(`http://localhost:5000/user/${userId}`);
        if (!profileResponse.ok) {
          throw new Error('Failed to fetch profile');
        }
        const profileData = await profileResponse.json();
        setProfile(profileData);

        // Fetch user bookings
        const bookingsResponse = await fetch(`http://localhost:5000/bookings/${userId}`);
        if (!bookingsResponse.ok) {
          throw new Error('Failed to fetch bookings');
        }
        const bookingsData = await bookingsResponse.json();
        setBookings(bookingsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndBookings();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <Navbar /><br/>
      <div className="profile-container">
        <div className="profile-card">
          {profile && (
            <div className="profile-details">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTKStfX9sgtEzv2SpTQnkHKNsuxr9oiaiTot81geKYIQQEYSJ60-leaQkZ-OOw4wrexQo&usqp=CAU" alt="User Profile" />
              <h2 style={{color:"#33567c"}}>{profile.fullName}'s Profile</h2>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Phone Number:</strong> {profile.phoneNumber}</p>
              <p><strong>City:</strong> {profile.city}</p>
            </div>
          )}
        </div>
        <div className="bookings-table">
          <h2 style={{color:"#33567c"}}>Booking Details</h2>
          {bookings.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Station Name</th>
                  <th>Vehicle Number</th>
                  <th>Date</th>
                  <th>Services</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id}>
                    <td>{booking.stationName}</td>
                    <td>{booking.vehicleNumber}</td>
                    <td>{new Date(booking.date).toLocaleDateString()}</td>
                    <td>{booking.services.join(', ')}</td>
                    <td>{booking.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div>No bookings found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
