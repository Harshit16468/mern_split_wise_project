const nodemailer = require('nodemailer');
const crypto = require('crypto');
const config = require('../config/emailConfig');
const { MongoClient, ServerApiVersion } = require('mongodb');
const encodeURIComponent = require('querystring').escape;

const rawPassword = 'Harshit@123';
const encodedPassword = encodeURIComponent(rawPassword);

const uri = `mongodb+srv://harshit:${encodedPassword}@cluster0.csw5jmw.mongodb.net/split?retryWrites=true&w=majority&appName=Cluster0`;
const dbName = "split";
const transporter = nodemailer.createTransport({
  service: config.email.service,
  auth: {
    user: config.email.auth.user,
    pass: config.email.auth.pass
  }
});

async function queryDatabase(email) {
  let client;
  try {
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
  await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db(dbName);
    const query = { email: email };

    const result = await db.collection("split").find(query).toArray();

    if (result.length === 0) {
      console.log("No documents found");
      return false;
    } else {
      console.log("Documents found:", result);
      return true;
    }

  } catch (err) {
    console.error("Failed to query the database:", err);
    return false;
  } finally {
    if (client) {
      await client.close();
    }
  }
}

exports.sendOtp = async (req, res) => {
  const { email } = req.body;
  try {
    const result = await queryDatabase(email);
    console.log("hello");
    console.log(result);
    if (result) {
      console.log("User exists, sending error response");
      return res.status(500).send('Please Login');
    } else {
      const otp = crypto.randomBytes(3).toString('hex');
      req.session.otp = otp;
      req.session.email = email;
      console.log("otp", req.session.otp)
      const mailOptions = {
        from: config.email.auth.user,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}`
      };

      console.log(otp)
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          return res.status(500).send('Error sending email');
        } else {
          return res.status(200).send('OTP sent');
        }
      });
    }
  } catch (error) {
    console.error("Error in sendOtp:", error);
    return res.status(500).send('Internal Server Error');
  }
};

async function insertDocument(email) {
  let client;
  try {
    client = lient = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
  await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db(dbName);
    const myobj = { email: email, friends: [], groups: [] };

    const result = await db.collection("split").insertOne(myobj);
    console.log("1 document inserted", result.insertedId);
  } catch (err) {
    console.error("Failed to insert document:", err);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  console.log(otp, "the otp is here ")
  if (req.session.otp === otp && req.session.email === email) {
    try {
      console.log("here");
      await insertDocument(email);

      return res.status(200).send('Sign up successful');
    } catch (error) {
      console.error("Error in verifyOtp:", error);
      return res.status(500).send('Internal Server Error');
    }
  } else {
    return res.status(400).send('Invalid OTP');
  }
};
