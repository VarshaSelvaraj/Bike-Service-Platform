import React, { useEffect, useState } from 'react';
import BookingForm from './Customer/BookingForm';
import Navbar from './Navbar';
import { FaTimes } from 'react-icons/fa';
import './Styles/stationdisplay.css';

//images that sequentially display on the card as bike station are added
const defaultImages = [
  'https://static.vecteezy.com/system/resources/previews/033/292/353/non_2x/hand-drawn-motorcycle-mechanic-character-with-smartphone-in-the-concept-of-online-repair-technician-in-flat-style-png.png',
  'https://media.istockphoto.com/id/1264526153/vector/man-repairing-motorbike-motorcycle-fixing-vector.jpg?s=612x612&w=0&k=20&c=Yw3wB_iVqPE3lzth_N-kzCiDgm-oPsBCkKe6WYoUB6I=',
  'https://static.vecteezy.com/system/resources/thumbnails/020/535/277/small_2x/man-recording-his-motorcycle-using-camera-motorcycle-blogger-free-vector.jpg',
  'https://thumbs.dreamstime.com/b/bearded-hipster-guy-motorcycle-customization-service-vector-flat-illustration-mechanic-man-assemble-parts-motorbike-garage-185951717.jpg',
  'https://img.freepik.com/premium-vector/motorcycle-mechanic_1034-1074.jpg',
  'https://www.apnamechanic.com/wp-content/uploads/2023/01/AP-Mechanic-Spare-Parts-1024x724.jpg',
  'https://static.vecteezy.com/system/resources/previews/030/206/449/non_2x/hand-drawn-motorcycle-mechanic-in-flat-style-vector.jpg',

];

const BikeStationDisplay = () => {
  const [bikeStations, setBikeStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [flippedIndex, setFlippedIndex] = useState(null);

  useEffect(() => {
    fetchBikeStations();
  }, []);

//fetching bike station details using backend routes 
  const fetchBikeStations = async () => {
    try {
      const response = await fetch('https://bike-service-platform.onrender.com/bikestations');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setBikeStations(data);
    } catch (error) {
      console.error('Error fetching bike stations:', error);
    }
  };

  const handleBookingClick = (station) => {
    setSelectedStation(station);
  };

  const closeBookingForm = () => {
    setSelectedStation(null);
  };
//to handle flipping of card
  const handleCardClick = (index) => {
    setFlippedIndex(flippedIndex === index ? null : index); 
  };

  return (
    <div>
      <Navbar />
     <br/><br/>
      <div className="bike-station-list">
        {bikeStations.map((station, index) => (
          <div key={station._id} className="bike-station-card" onClick={() => handleCardClick(index)}>
            <div className={`card-inner ${flippedIndex === index ? 'flipped' : ''}`}>
              <div className="card-front">
              
                <img src={defaultImages[index % defaultImages.length]} alt="Bike Station " />
                <h2>{station.stationName}</h2>
                
                <p>{station.address}</p>
                <button>View Details</button>
              </div>
              <div className="card-back">
                <h2>{station.stationName}</h2>
                <FaTimes className="close-icon" onClick={() => setFlippedIndex(null)} />
                <p><i>{station.description}</i></p> 
                <p><strong>Contact Number:</strong> {station.contactNumber}</p>
                <p><strong>Services:</strong> {station.services.join(', ')}</p>
                <button onClick={() => handleBookingClick(station)}>Make a booking</button>
              </div>
            </div>
          </div>
        ))}
        {selectedStation && (
          <BookingForm station={selectedStation} onClose={closeBookingForm} />
        )}
      </div>
    </div>
  );
};

export default BikeStationDisplay;
