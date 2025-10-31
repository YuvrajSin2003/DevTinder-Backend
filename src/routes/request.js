const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");


//-------------------Sender Connection Request-------------------//

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.userId;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Invalid Status type " + status });
      }

      const user = await User.findById(toUserId);
      if (!user) {
        return res.status(404).json({ message: "User Not Found" });
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId }
        ]
      });

      if (existingConnectionRequest) {
        return res.status(400).json({ message: "Connection request already exists" });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();
      res.json({
        message: `${req.user.firstName} is ${status} in ${user.firstName}`,
        data
      });
    } catch (err) {
      res.status(400).send("ERROR " + err.message);
    }
  }
);



//-------------------Reciver Connection Request-------------------//

requestRouter.post("/request/review/:status/:requestId", userAuth , async (req, res) => {
  try {
    const loggedInUserId = req.userId;
    const { status, requestId } = req.params;

    // check the status valid
    const allowedStatus = ["ignored", "accepted"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Status is not allowed" });
    }
    
    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUserId,
      status: "interested",
    });

    if (!connectionRequest) {
      return res.status(404).json({ message: "No pending request found" });
    }

    connectionRequest.status = status;
    const data = await connectionRequest.save();

    res.json({ message: "Connection request " + status, data });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});





module.exports = requestRouter;
