# BikeHub - Bike Services Platform

## Overview
BikeHub allows users to discover nearby bike service stations, make bookings, and manage their services. Bike service station owners can register their stations and manage bookings through the platform.

## TechStack
- Frontend: React
- Backend: Node.js (Express)
- Database: MongoDB Atlas
- Others: CSS for styling, React Router for navigation

## Modules
- Customer Module(Login userType - customer)
- Bike Station Owner Module(Login userType - owner)
  
## Features for customers
- Discover bike services at preferred locations.
- Make bookings.
- Manage and track bookings.

## Features for owners
- Register Bike Service Stations.
- Manage bookings and services.

## Project Structure
BIKE-SERVICE
├── node_modules
├── public
│ ├── bikecare-icon.webp
│ ├── bikegif.gif
│ ├── homegif.gif
│ ├── index.html
│ ├── manifest.json
│ └── robots.txt
├── src
│ ├── Components
│ │ ├── Customer
│ │ │ ├── BookingForm.js
│ │ │ └── Profile.js
│ │ ├── Owner
│ │ │ ├── DashBoard.js
│ │ │ └── ServiceForm.js
│ │ ├── Styles
│ │ │ ├── BookingForm.css
│ │ │ ├── CustomerProfile.css
│ │ │ ├── Home.css
│ │ │ ├── Login.css
│ │ │ ├── Navbar.css
│ │ │ ├── OwnerDashboard.css
│ │ │ ├── serviceform.css
│ │ │ ├── SignUp.css
│ │ │ └── stationdisplay.css
│ │ ├── Navbar.js
│ │ ├── Home.js
│ │ ├── Login.js
│ │ ├── SignUp.js
│ │ ├── StationDisplay.js
│ │ ├── Models
│ │ │ ├── BikeStation.js
│ │ │ ├── Booking.js
│ │ │ └── Users.js
│ ├── App.css
│ ├── App.js
│ ├── App.test.js
│ ├── index.css
│ ├── index.js
│ ├── reportWebVitals.js
│ ├── server.js
│ └── setupTests.js

## Running the application
Make sure you have the following software installed on your machine:
- Node.js
- npm
- MongoDB Atlas Account
  
1. Clone the repository
  git clone https://github.com/yourusername/bikehub-services.git
  cd bikehub-services
2. To run the backend server
   - Navigate to src folder
     cd src
   - Install the following dependencies using the commands
     npm install express mongoose body-parser cors jsonwebtoken bcrypt nodemailer
   - Run the server
     node server.js
3. To run the frontend code
   - Install the following dependencies using the commands in the root folder
     npm install react-router-dom
     npm install react-icons
     npm install --save @fortawesome/react-fontawesome
     npm install --save @fortawesome/free-solid-svg-icons
   - Start the app
     npm start
     
## DataBase Schema Structure
├── bike-service
│ ├── BikeStation collection
│ ├── Booking collection
│ ├── Users collection

1. Users Schema
  fullName: String,         
  email: String,
  phoneNumber: String,
  userType: String,
  password: String,
  city: String,
  pinCode: Number
2. BikeStation
  stationName: { type: String, required: true },
  location: { type: String, required: true },
  address: { type: String, required: true },
  contactPerson: { type: String, required: true },
  contactNumber: { type: String, required: true },
  description: { type: String, required: true },
  services: { type: [String], required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
3. Booking Schema
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

## Sample data
1. User
    fullName:"Varsha Selvaraj"
    email:"varshaselvaraj04@gmail.com"
    phoneNumber:"8072555204"
    userType:"Bike Station Owner"
    password:Hashed password
    city:"Gobi"
    pinCode:638476
2. BikeStation
    stationName:"24 BikeCare Services"
    location:"Erode"
    address:"18a, Avalpoodurai Road, Perundurai."
    contactPerson:"Vithya"
    contactNumber:"9876543201"
    description:"Doorstep pickup, convincing services, customer satisfication is our ma…"
    services:
      0:"GeneralService"
      1:"WaterWash"
      2:"RepairServices"
    userId:6690c6d8ee7a173da20aa0a2
3. Booking
    userId:6690c77aee7a173da20aa0b2
    stationId:669158aaca56cadf92a92bd0
    stationName:"WheelCare Bike Station"
    customerName:"varsha"
    email:"varshaselvaraj04@gmail.com"
    phone:"8900048585"
    vehicleModel:"Activa"
    vehicleNumber:"TN 00 9 5885"
    date:2024-08-01T00:00:00.000+00:00
    services:
      0:"OilChange"
    status:"Pending"

## Thank you!

