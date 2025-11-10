const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send("No token provided, please log in");
    }

    const decodedObj = jwt.verify(token, "DEV@Tinder$7900");
    const { _id } = decodedObj;

    const user = await User.findById(_id);
    if (!user) {
      // Log for user not found
      console.error(`!!! AUTH ERROR: User not found with ID: ${_id}`);
      return res.status(404).send("User not found");
    }

    req.userId = user._id;
    req.user = user;
    next();
  } catch (err) {
    // Log for any other errors (like expired token)
    console.error("!!! AUTH MIDDLEWARE CATCH BLOCK:", err.message);
    res.status(401).send("Invalid token: " + err.message);
  }
};

module.exports = { userAuth };