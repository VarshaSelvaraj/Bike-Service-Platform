const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  stationId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'BikeStation' },
  stationName: { type: String, required: true },
  customerName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  vehicleModel: { type: String, required: true },
  vehicleNumber: { type: String, required: true },
  date: { type: Date, required: true },
  services: { type: [String], required: true },
  status: { type: String, default: 'Pending' },
});

module.exports = mongoose.model('Booking', bookingSchema);
