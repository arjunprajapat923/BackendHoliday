const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const cors = require('cors');
const app = express();

app.use(cors({ origin: 'frontend-holiiday.vercel.app', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//connecting to the database
connectDB();

app.use("/api/users", userRoutes);
//server connection
app.listen(8000, () => {
    console.log("yes listening to the port ")
} )