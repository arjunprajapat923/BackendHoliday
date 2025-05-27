const User = require("../models/user");
const express = require("express");
const bcrypt = require("bcryptjs");
const QRCode = require("qrcode");
const admin = require("../config/firebase");

//contorllers create and login 


exports.createUser = async (req, res) => {
  try {
    const { name, email, password, image } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const qrData = `Name: ${name}\nEmail: ${email}`;
    const qrCodeImage = await QRCode.toDataURL(qrData); 

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      image,
      qrCode: qrCodeImage,
    });

    await newUser.save();

    res.status(201).json({ message: "User created successfully", user: newUser });

  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
      },
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};



exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    // Generate a QR code for each user with their info
    const usersWithQR = await Promise.all(users.map(async (user) => {
      const qrData = JSON.stringify({
        name: user.name,
        email: user.email,
        image: user.image || '',
      });
      let qrCode = user.qrCode;
      try {
        qrCode = await QRCode.toDataURL(qrData);
      } catch (err) {
        qrCode = '';
      }
      return {
        ...user.toObject(),
        qrCode,
      };
    }));
    res.status(200).json({ users: usersWithQR });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUserByUID = async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await User.findOne({ firebaseUID: uid }, '-password'); // Exclude password
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user by UID:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.firebaseLogin = async (req, res) => {
  const idToken = req.body.token;
  console.log(idToken)

  if (!idToken) {
    return res.status(400).json({ message: "No token provided" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;

    if (!email) {
      return res.status(400).json({ message: "No email in token" });
    }

    let user = await User.findOne({ firebaseUID: uid });

    if (!user) {
      user = new User({
        firebaseUID: uid,
        name: name || "No Name",
        email,
        image: picture || "",
        password: "", 
      });
      await user.save();
    } else {
    
      let updateNeeded = false;
      if (user.email !== email) {
        user.email = email;
        updateNeeded = true;
      }
      if (name && user.name !== name) {
        user.name = name;
        updateNeeded = true;
      }
      if (picture && user.image !== picture) {
        user.image = picture;
        updateNeeded = true;
      }
      if (updateNeeded) await user.save();
    }


    return res.status(200).json({
      message: "Firebase login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
      },
    });
  } catch (error) {
    console.error("Firebase token verify error:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};
