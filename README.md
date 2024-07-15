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
  
## If you login as customers
- Discover bike services at preferred locations.
- Make bookings.
- Manage and track bookings.

## If you login as owners
- You will have an access to a dashboard where you can update status of the bookings and edit services.
- Register Bike Service Stations.
- Manage bookings and services.

## Project Structure
![image](https://github.com/user-attachments/assets/74754134-fd0b-4c6a-a771-e4e5c09fb91f)

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
   
## Demonstration
![image](https://github.com/user-attachments/assets/0423573f-bc76-40a8-a400-f6c604086b04)
![image](https://github.com/user-attachments/assets/29887440-207b-463e-ae39-323822bdedae)
![image](https://github.com/user-attachments/assets/aceeb220-cb1e-4935-a71f-e2cfb8cdf815)
![image](https://github.com/user-attachments/assets/3a9be835-bc36-4776-afe1-7ff8807eab81)
![image](https://github.com/user-attachments/assets/d1f8b6f9-765b-4850-928e-5def155a151f)
![image](https://github.com/user-attachments/assets/28c8ce75-9e98-4d96-9256-37f437ad28ff)
![image](https://github.com/user-attachments/assets/8ee017ae-1eab-4c88-b398-16b158e2148f)

## Thank you!!


