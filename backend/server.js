const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const otpRoutes = require('./routes/otpRoutes');

const app = express();
const port = 5001;

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
