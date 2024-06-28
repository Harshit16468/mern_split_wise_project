const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const otpRoutes = require('./routes/otpRoutes');
const otpRoutes1 = require('./routes/otpRoutes1');
const axios = require('axios');
const encodeURIComponent = require('querystring').escape;

const rawPassword = 'Harshit@123';
const encodedPassword = encodeURIComponent(rawPassword);

const uri = `mongodb+srv://harshit:${encodedPassword}@cluster0.csw5jmw.mongodb.net/split?retryWrites=true&w=majority&appName=Cluster0`;
const dbName = "split";
let db;
const { MongoClient, ServerApiVersion } = require('mongodb');


async function initializeDatabase() {
    try {
      const client = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
      });
        await client.connect();
        console.log("Connected to MongoDB");

        db = client.db(dbName);
        await db.createCollection("split");
        console.log("Collection created!");
    } catch (err) {
        console.error("Failed to initialize database:", err);
    }
}

initializeDatabase();


const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use('/api', otpRoutes);
app.use('/apilogin',otpRoutes1)
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
app.post('/oauth2callback', async (req, res) => {
  const { code } = req.body;
  console.log("the code is ",code);
  const clientId = '716338759481-3t52ihgb9pa4ifk96mjnlehh8c0idr07.apps.googleusercontent.com';
  const clientSecret = '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';
  const redirectUri = 'http://localhost:3000/oauth/callback';

  try {
      const response = await axios.post('https://oauth2.googleapis.com/token', {
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code',
      });

      const { access_token } = response.data;
      res.send({ access_token });
      console.log("done succesful");

  } catch (error) {
      res.status(500).send(error);
      console.log("not done succesful");

  }
});

app.get('/contacts', async (req, res) => {
  const { access_token } = req.query;
  console.log("the token is ",access_token);
  try {
      let allContacts = [];
      let nextPageToken = null;
      
      do {
          const response = await axios.get('https://people.googleapis.com/v1/people/me/connections', {
              params: {
                  personFields: 'names,emailAddresses,phoneNumbers', // Include phone numbers
                  pageToken: nextPageToken, // Token for the next page of results
              },
              headers: {
                  Authorization: `Bearer ${access_token}`,
              },
          });
          if (response.data.connections) {
              allContacts = allContacts.concat(response.data.connections);
          }
          nextPageToken = response.data.nextPageToken;
      } while (nextPageToken);
      res.send(allContacts)
  } catch (error) {
      // console.log(error);
      res.status(500).send(error);
  }
});


app.post('/create-group', (req, res) => {
  const { groupName, contacts } = req.body;

  console.log('Received data:', { groupName, contacts });

  if (!groupName || !contacts) {
      return res.status(400).send('Group name and contacts are required');
  }

  const newGroup = {
      name: groupName,
      contacts,
  };

  res.status(201).send({ message: 'Group created successfully' , newGroup});
});
