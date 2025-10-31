const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const { validateEditProfileData } = require("../utils/validation");

// --------------------- PROFILE ROUTE ---------------------
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user; // set by userAuth middleware
    res.send(user); // return the authenticated user
  } catch (err) {
    res.status(500).send("Server error: " + err.message);
  }
});

// --------------------- PROFILE EDIT ROUTE ---------------------

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid credential for update");
    }

    const loggedInUser = req.user; // set by userAuth middleware
    console.log(loggedInUser);
    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });
    await loggedInUser.save();
    console.log(loggedInUser);
    res.json({
      message : `${loggedInUser.firstName} your profile has been updated successfully`,
      data : loggedInUser
  });
  } catch (err) {
    res.status(400).send("Error updating profile: " + err.message);
  }
});



module.exports = profileRouter;
