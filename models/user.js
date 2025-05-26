const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: { 
    type: String,
    required: true,
  },
  password: { 
    type: String,
    required: true,
  },
  image: { 
    type: String,
    required: false,
  },
  phoneNumber:{
     type: Number,
     required:false
  },
  qrCode: {
    type: String
  },
  firebaseUID: { type: String, unique: true, sparse: true },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
