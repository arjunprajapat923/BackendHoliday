const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("../backend/config/db");
const userRoutes = require("./routes/userRoutes");
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//connecting to the database
connectDB();

app.use("/api/users", userRoutes);
//server connection
app.listen(8000, () => {
    console.log("yes listening to the port ")
} )