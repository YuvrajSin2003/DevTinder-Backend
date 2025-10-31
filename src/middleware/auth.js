const jwt = require("jsonwebtoken");
const User = require("../models/user");


const userAuth = async (req, res, next) => {
  try {
    // read token from cookies
    const { token } = req.cookies; // extract token form cookies
    if (!token) {
      return res.status(401).send("No token provided, please log in");
    }
 
    // verify token
    const decodedObj = jwt.verify(token, "DEV@Tinder$7900");
    const { _id } = decodedObj; // finding the id

    // if id present in DB  find user
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).send("User not found");
    }

    // attach user to request
    req.userId = user._id;   // ✅ fixes your route
    req.user = user;
    next();
  } catch (err) {
    res.status(401).send("Invalid token: " + err.message);
  }
};

module.exports = { userAuth };
