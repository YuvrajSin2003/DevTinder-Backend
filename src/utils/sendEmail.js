const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

const client = new SESClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

async function sendEmail() {
  const command = new SendEmailCommand({
    Source: "yuvrajraghuvanshisingh@gmail.com",
    Destination: {
      ToAddresses: ["receiver@email.com"]
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
  console.log(response);
}

sendEmail();