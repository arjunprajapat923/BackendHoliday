const express = require("express");
const router = express.Router();
const verifyFirebaseToken = require("../middleware/firebaseAuth");

const {createUser, loginUser, firebaseLogin} = require("../controllers/userController")

router.post("/register" ,createUser );
router.post("/login", loginUser);
router.post("/firebase-login", firebaseLogin);


router.get("/protected", verifyFirebaseToken, (req, res) => {
    res.json({ message: "You are authorized", uid: req.user.uid });
  });

module.exports = router;