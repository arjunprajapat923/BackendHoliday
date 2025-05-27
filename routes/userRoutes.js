const express = require("express");
const router = express.Router();
const verifyFirebaseToken = require("../middleware/firebaseAuth");

const {createUser, loginUser, firebaseLogin, getAllUsers} = require("../controllers/userController")

router.post("/register" ,createUser );
router.post("/login", loginUser);
router.post("/firebase-login", verifyFirebaseToken, firebaseLogin);


router.get("/protected", verifyFirebaseToken, (req, res) => {
    res.json({ message: "You are authorized", uid: req.user.uid });
  });

router.get("/all", getAllUsers);

module.exports = router;