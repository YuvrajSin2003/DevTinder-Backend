const express = require('express')
const authRouter = express.Router();
const User = require("../models/user");
const {validateSignUpData} = require("../utils/validation");
const bcrypt = require("bcrypt");


// --------------------- SIGNUP ROUTE ---------------------
authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    // Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user with hashed password
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("Error saving user: " + err.message);
  }
});


// --------------------- LOGIN ROUTE ---------------------
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }
        // validatePassword should be a method in your User schema
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      
      const token = await user.getJWT();

     
     res.cookie("token", token, {
  httpOnly: true,
  secure: false,          // ⚠️ use true only in production with HTTPS
  sameSite: "none",        // or "none" if you're using HTTPS + cross-origin
  expires: new Date(Date.now() + 8 * 3600000),
  path: "/",              // explicitly allow all routes
});

      res.send("Login successful");
    } else {
      throw new Error("Invalid password");
    }
  } catch (err) {
    res.status(400).send("Login failed: " + err.message);
  }
});

// --------------------- LOG Out ---------------------

authRouter.post("/logout" , (req, res) => {
  res.cookie("token" , null , {
    expires: new Date(Date.now()),
  });
  res.send("User log-out");
})


module.exports = authRouter;