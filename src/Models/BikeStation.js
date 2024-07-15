const mongoose = require('mongoose');
const BikeStationSchema = new mongoose.Schema({
  stationName: { type: String, required: true },
  location: { type: String, required: true },
  address: { type: String, required: true },
  contactPerson: { type: String, required: true },
  contactNumber: { type: String, required: true },
  description: { type: String, required: true },
  services: { type: [String], required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});
const BikeStation = mongoose.model('BikeStation', BikeStationSchema);
module.exports = BikeStation;
