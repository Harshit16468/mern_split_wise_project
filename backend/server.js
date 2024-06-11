const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const otpRoutes = require('./routes/otpRoutes');
const axios = require('axios');

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
      const response = await axios.get('https://people.googleapis.com/v1/people/me/connections', {
          params: {
              personFields: 'names,emailAddresses,phoneNumbers', // Include phone numbers
          },
          headers: {
              Authorization: `Bearer ${access_token}`,
          },
      });

      res.send(response.data);
  } catch (error) {
      // console.log(error);
      res.status(500).send(error);
  }
});