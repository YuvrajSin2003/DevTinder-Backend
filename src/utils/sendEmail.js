const { SendEmailCommand } = require("@aws-sdk/client-ses");
const client = require("./sesClient");

const sendEmail = async () => {
  try {
    const command = new SendEmailCommand({
      Source: "yuvrajraghuvanshisingh@gmail.com",
      Destination: {
        ToAddresses: ["yuvrajraghuvanshisingh@gmail.com"] // ✅ verified
      },
      Message: {
        Subject: {
          Data: "Test Email"
        },
        Body: {
          Html: {
            Data: "<h1>Hello</h1><p>Email from SES</p>"
          }
        }
      }
    });

    const response = await client.send(command);
    console.log("Email sent:", response);
  } catch (err) {
    console.error("Email failed:", err.message);
  }
};

module.exports = sendEmail;