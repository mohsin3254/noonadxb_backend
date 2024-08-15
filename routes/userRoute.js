const express = require("express");
const router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid"); // Add this import at the top

router.post("/register", async (req, res) => {
  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).send("User Registered Successfully");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

best;
router.post("/guestlogin", (req, res) => {
  try {
    const guestUserId = uuidv4(); // Generate a unique guest ID
    const guestUser = {
      _id: guestUserId,
      name: "Guest User",
      isAdmin: false,
    };

    const token = jwt.sign(
      { _id: guestUser._id, isAdmin: guestUser.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res
      .header("Authorization", `Bearer ${token}`)
      .send({ token, user: guestUser, guestUserId }); // Include guestUserId in response
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

/* Working without unique id
router.post("/guestlogin", (req, res) => {
  try {
    const guestUser = {
      _id: "guestUser", // You can generate a unique ID if needed
      name: "Guest User",
      isAdmin: false,
    };

    const token = jwt.sign(
      { _id: guestUser._id, isAdmin: guestUser.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res
      .header("Authorization", `Bearer ${token}`)
      .send({ token, user: guestUser });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});
*/

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && user.password === password) {
      const token = jwt.sign(
        { _id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.header("Authorization", `Bearer ${token}`).send({ token, user });
    } else {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.post("/getallusers", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

module.exports = router;
/*
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Generate Password Reset Token
const generateResetToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

// Send email function
const sendEmail = async (to, subject, html) => {
  const msg = {
    to,
    from: process.env.EMAIL_USER,
    subject,
    html,
  };
  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// Forgot Password Route
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const resetToken = generateResetToken();
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; // Token valid for 1 hour
    await user.save();

    const resetURL = `http://localhost:3000/reset-password/${resetToken}`;

    const html = `<p>To reset your password, click the following link: <a href="${resetURL}">Reset Password</a></p>`;
    await sendEmail(email, "Password Reset", html);

    res.status(200).send("Password reset link sent");
  } catch (error) {
    console.error("Error:", error);
    res.status(400).json({ message: error.message });
  }
});

router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }, // Token must be valid
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    // Hash the new password and update the user
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = undefined; // Clear the reset token
    user.resetTokenExpiry = undefined; // Clear the token expiry
    await user.save();

    res.status(200).send("Password has been reset successfully");
  } catch (error) {
    console.error("Error:", error);
    res.status(400).json({ message: error.message });
  }
});

router.post("/register", async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).send("User Registered Successfully");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && user.password === password) {
      const token = jwt.sign(
        { _id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.header("Authorization", `Bearer ${token}`).send({ token, user });
    } else {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.post("/getallusers", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

module.exports = router;  */

/*
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware"); // Import middleware

router.get(
  "/admin/data",
  authMiddleware,
  authMiddleware.isAdmin,
  (req, res) => {
    res.send("This is protected admin data");
  }
);

// Register a new user
router.post("/register", async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).send("User Registered Successfully");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Login user and generate token
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && user.password === password) {
      const token = jwt.sign(
        { _id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.header("Authorization", `Bearer ${token}`).send({ token, user });
    } else {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// Get all users (admin only)
router.post(
  "/getallusers",
  authMiddleware,
  authMiddleware.isAdmin,
  async (req, res) => {
    try {
      const users = await User.find();
      res.send(users);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
);

module.exports = router;
*/

/*
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && user.password === password) {
      const token = jwt.sign(
        { _id: user._id, isAdmin: user.isAdmin },
        "process.env.JWT_SECRET",
        { expiresIn: "1h" }
      );
      res.header("Authorization", token).send({ token, user });
    } else {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});
*/
/*This Route is working fine with login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && user.password === password) {
      const token = jwt.sign(
        { _id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.header("Authorization", `Bearer ${token}`).send({ token, user });
    } else {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});
*/
