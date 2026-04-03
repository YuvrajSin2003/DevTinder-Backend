const { SESClient } = require("@aws-sdk/client-ses");

const client = new SESClient({
  region: "ap-south-1", // ✅ FIXED (match your verified region)
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

module.exports = client;