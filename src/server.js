//importing required modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const BikeStation = require('./Models/BikeStation');
const Booking = require('./Models/Booking');
const app = express();
const port = 5000;

// Middleware for application
app.use(cors());
app.use(bodyParser.json());

// establishing connection to atlas
const uri = 'mongodb+srv://varsha:varsha12345678@cluster0.hblbul8.mongodb.net/bike-service?retryWrites=true&w=majority';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

// user schema definition
const userSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phoneNumber: String,
  userType: String,
  password: String,
  city: String,
  pinCode: Number
});

const User = mongoose.model('User', userSchema);

// Route for signup storing all the details to db
app.post('/signup', async (req, res) => {
  const { fullName, email, phoneNumber, userType, password, city, pinCode } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      fullName,
      email,
      phoneNumber,
      userType,
      password: hashedPassword,
      city,
      pinCode
    });
    await newUser.save();
    const token = jwt.sign({ userId: newUser._id, userType: newUser.userType }, 'your_secret_key', { expiresIn: '1h' });
    res.status(201).json({ token, userId: newUser._id }); 
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
//route for login verifying whether the username, email are in the db and usertype is correct
app.post('/login', async (req, res) => {
  const { email, password, userType } = req.body;

  try {
    const user = await User.findOne({ email, userType });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or user type' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ id: user._id, userType: user.userType }, 'secret_key', { expiresIn: '1h' });
    res.json({ token, userId: user._id, message: 'Login successful' }); // Return userId
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route for registering bike station stores bike station details along with logged in userId(Owner userID)
app.post('/bikestation/register', async (req, res) => {
  const { stationName, location, address, contactPerson, contactNumber, description, services, userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }
  const newBikeStation = new BikeStation({
    stationName,
    location,
    address,
    contactPerson,
    contactNumber,
    description, 
    services,
    userId,
  });

  try {
    await newBikeStation.save();
    res.status(201).json('Bike station registered successfully');
  } catch (error) {
    console.error('Failed to register bike station:', error);
    res.status(400).json({ message: 'Failed to register bike station', error });
  }
});

//fetching bike station details using userId stored along with bikstation details
app.get('/bikestations', async (req, res) => {
  try {
    const bikeStations = await BikeStation.find();
    res.json(bikeStations);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch bike stations', error });
  }
});

// fetching bike stations by userId
app.get('/bikestations/user/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const bikeStations = await BikeStation.find({ userId });
    res.json(bikeStations);
  } catch (error) {
    console.error('Error fetching bike stations:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
//fetching user details to be dispalyed on profile using userId
app.get('/user/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const ownerDetails = {
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      city: user.city,
    };

    res.json(ownerDetails);
  } catch (error) {
    console.error('Error fetching owner details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
//configuring mail to send mail to user & customer after booking
 const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'bikehubservices@gmail.com',
    pass:'nlri msbc xzlg jrte',
  },
  secure: false, 
  tls: {
    rejectUnauthorized: false 
  }
});


// Route for handle bookings storing booking details to db
app.post('/bookings', async (req, res) => {
  const { userId, stationId, stationName, customerName, email, phone, vehicleModel, vehicleNumber, date, services, status = 'Pending' } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  const newBooking = new Booking({
    userId,
    stationId,
    stationName,
    customerName,
    email,
    phone,
    vehicleModel,
    vehicleNumber,
    date,
    services,
    status,
  });
  const bikeStation = await BikeStation.findById(stationId).populate('userId');
    
  if (!bikeStation || !bikeStation.userId) {
    return res.status(404).json({ message: 'Bike station or owner not found' });
  }

  const ownerEmail = bikeStation.userId.email;

  try {
    await newBooking.save();

    // Sending confirmation email to the user
    const mailOptions = {
      from: 'bikehubservices@gmail.com',
      to: email,
      subject: 'Booking Confirmation',
      text: `
        Hi ${customerName},
          Your booking to the${stationName} has been successfully submitted!
        Booking Details
        Vehicle Model: ${vehicleModel}
        Vehicle Number: ${vehicleNumber}
        Date: ${date}
        Services: ${services.join(', ')}
        Status: ${status}
        Thank you for choosing bikehubservices!

        Best,
        BikeHubServices.
      `,
    };
    //Sending confirmation email to the owner
    await transporter.sendMail(mailOptions);
    const ownerMailOptions = {
      from: 'bikehubservices@gmail.com',
      to: ownerEmail,
      subject: 'New Booking Notification',
      text: `
        Hello,
          A new booking has been made for your bike station!
        Booking Details:
        Customer Name: ${customerName}
        Customer Email: ${email}
        Customer Phone: ${phone}
        Vehicle Model: ${vehicleModel}
        Vehicle Number: ${vehicleNumber}
        Date: ${date}
        Services: ${services.join(', ')}
        
        Please take note of this booking.

        Best,
        BikeHubServices.
      `,
    };

    await transporter.sendMail(ownerMailOptions);
    res.status(201).json('Booking submitted successfully and confirmation email sent.');
  } catch (error) {
    console.error('Failed to submit booking:', error);
    res.status(400).json({ message: 'Failed to submit booking', error });
    console.log('Email:', process.env.EMAIL_USER);
    console.log('Password:', process.env.EMAIL_PASS ? '****' : 'Not Set'); // Don't log the actual password

  }
});
//Route to update the status of the booking and replacing in the db
app.put('/bookings/status/:id', async (req, res) => {
  const bookingId = req.params.id;
  const { status } = req.body;

  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true } 
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
      // if status is updated to Ready for delivery, sending an email to the user
      if (status === 'Ready') {
        const mailOptions = {
          from: 'bikehubservices@gmail.com',
          to: updatedBooking.email, 
          subject: 'Your Vehicle is Ready for Pickup',
          text: `
            Hi ${updatedBooking.customerName},
  
            We are pleased to inform you that your vehicle is ready for delivery!
  
            Booking Details:
            Station Name: ${updatedBooking.stationName}
            Vehicle Model: ${updatedBooking.vehicleModel}
            Vehicle Number: ${updatedBooking.vehicleNumber}
            Date: ${new Date(updatedBooking.date).toLocaleDateString()}
            Services: ${updatedBooking.services.join(', ')}
  
            Thank you for choosing our service!
  
            Best,
            BikeHubServices.
          `,
        };
  
        await transporter.sendMail(mailOptions);
      }
    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking status', error });
  }
});

//add,edit,remove services
// Route to add a service to a bike station by matching stationID
app.put('/bikestation/addservice/:stationId', async (req, res) => {
  const { stationId } = req.params;
  const { newService } = req.body;

  try {
    const bikeStation = await BikeStation.findById(stationId);
    if (!bikeStation) {
      return res.status(404).json({ message: 'Bike station not found' });
    }

    bikeStation.services.push(newService);
    await bikeStation.save();

    res.status(200).json({ message: 'Service added successfully', bikeStation });
  } catch (error) {
    console.error('Error adding service:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to edit a service in a bike station by matching stationID
app.put('/bikestation/editservice/:stationId', async (req, res) => {
  const { stationId } = req.params;
  const { serviceIndex, updatedService } = req.body;

  try {
    const bikeStation = await BikeStation.findById(stationId);
    if (!bikeStation) {
      return res.status(404).json({ message: 'Bike station not found' });
    }

    bikeStation.services[serviceIndex] = updatedService;
    await bikeStation.save();

    res.status(200).json({ message: 'Service updated successfully', bikeStation });
  } catch (error) {
    console.error('Error editing service:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to remove a service from a bike station by matching stationID
app.put('/bikestation/removeservice/:stationId', async (req, res) => {
  const { stationId } = req.params;
  const { serviceIndex } = req.body;

  try {
    const bikeStation = await BikeStation.findById(stationId);
    if (!bikeStation) {
      return res.status(404).json({ message: 'Bike station not found' });
    }

    bikeStation.services.splice(serviceIndex, 1);
    await bikeStation.save();

    res.status(200).json({ message: 'Service removed successfully', bikeStation });
  } catch (error) {
    console.error('Error removing service:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
//fetching booking details using station_id
app.get('/bookings/station/:stationId', async (req, res) => {
  try {
    const stationId = req.params.stationId;
    const bookings = await Booking.find({ stationId }).exec();
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

//posting user details for the profile
app.post('/customer/profile', async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const customerProfile = {
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      city: user.city,
      pinCode: user.pinCode
    };

    res.json(customerProfile);
  } catch (error) {
    console.error('Error fetching customer profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

//fetching booking details with userid
app.get('/bookings/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const bookings = await Booking.find({ userId });
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
