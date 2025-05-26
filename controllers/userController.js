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
      const users = await User.find().select("-password"); 
      res.status(200).json({ users });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Server error" });
    }
};
  



exports.firebaseLogin = async (req, res) => {
  const idToken = req.body.token;

  if (!idToken) {
    return res.status(400).json({ message: "No token provided" });
  }

  try {
    // Verify token with Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;

    if (!email) {
      return res.status(400).json({ message: "No email in token" });
    }

    // Find user by firebaseUID
    let user = await User.findOne({ firebaseUID: uid });

    if (!user) {
      // If not found, create new user in MongoDB
      user = new User({
        firebaseUID: uid,
        name: name || "No Name",
        email,
        image: picture || "",
        password: "", // empty because Firebase handles auth
      });
      await user.save();
    } else {
      // Optionally update info if changed
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

    // Send back user info
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
