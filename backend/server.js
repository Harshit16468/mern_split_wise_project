var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var session = require('express-session');
var otpRoutes = require('./routes/otpRoutes');
var otpRoutes1 = require('./routes/otpRoutes1');
var axios = require('axios');
var encodeURIComponent = require('querystring').escape;

var rawPassword = 'Harshit@123';
var encodedPassword = encodeURIComponent(rawPassword);

var uri = `mongodb+srv://harshit:${encodedPassword}@cluster0.csw5jmw.mongodb.net/split?retryWrites=true&w=majority&appName=Cluster0`;
var dbName = "split";
var db;
var { MongoClient, ServerApiVersion } = require('mongodb');


async function initializeDatabase() {
    try {
      var client = new MongoClient(uri, {
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


var app = express();
var port = 3001;

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
async function queryDatabase(email) {
  var client;
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

      var db = client.db(dbName);
      var query = { email: email };

      var result = await db.collection("split").find(query).toArray();
      return result;

  } catch (err) {
      console.error("Failed to query the database:", err);
      return false;
  } finally {
      if (client) {
          await client.close();
      }
  }
}
app.post('/oauth2callback', async (req, res) => {
  function isPlainObject(obj) {
    return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
  }
  console.log(isPlainObject(req.body))
  console.log(req.body);
  var  code  = req.body.codes;
  var email=req.body.email;
  console.log("the code is ",code);
  console.log(email);


  try {

  

      try {
        var allContacts = [];
        var nextPageToken = null;
        
        do {
            var response = await axios.get('https://people.googleapis.com/v1/people/me/connections', {
                params: {
                    personFields: 'emailAddresses', // Include phone numbers
                    pageToken: nextPageToken, // Token for the next page of results
                },
                headers: {
                    Authorization: `Bearer ${code}`,
                },
            });
            if (response.data.connections) {
                allContacts = allContacts.concat(response.data.connections);
            }
            nextPageToken = response.data.nextPageToken;
        } while (nextPageToken);
        console.log("hello");
        var query = { email: email };
        var result=await queryDatabase(email);
        allContacts = allContacts.filter(contact => contact.emailAddresses && contact.emailAddresses.length > 0);
        result=result[0]
        var friends=[];
        console.log(allContacts);
        console.log(result);
        if((Array.isArray(result.friends))){
          friends=result.friends;}
          else{

          }
          console.log(allContacts.length)
          for(var i=0;i<allContacts.length;i++){
            console.log(allContacts[i].emailAddresses);
            for (var j=0;j<allContacts[i].emailAddresses.length;j++)
              {
              if (friends.includes(allContacts[i].emailAddresses[j].value))
              {
                continue
              }
              if(allContacts[i].emailAddresses[j].value==email)
              {
                continue
              }

              query={email:allContacts[i].emailAddresses[j].value}
              // var result = await db.collection("split").find(query).toArray();
              // console.log("hello");
              // console.log(result);
              // if(result.length==0)
              // {
              //   continue
              // }
              // else{
                friends.push(allContacts[i].emailAddresses[j].value);
                console.log(allContacts[i].emailAddresses[j].value)
                break

              // }
            }
          }
            console.log("here")
            console.log(friends)
          

            await db.collection("split").updateOne(
              { email: email },  // Filter criteria
              { $set: { friends: friends } }  // Update operation
          );
          if(!Array.isArray(result.groups)){
            await db.collection("split").updateOne(
              { email: email },  // Filter criteria
              { $set: { groups: [] } }  // Update operation
          );          }

        
        res.send("done")
    } catch (error) {
        // console.log(error);
        res.status(500).send(error);
    }


  } catch (error) {
      res.status(500).send(error);
      console.log("not done succesful");
      console.log(error)

  }
});

app.get('/contacts', async (req, res) => {
  var { email } = req.query;
  try {
    console.log(email);

    var result = await queryDatabase(email);
    result=result[0];
    var allContacts=[];
    if(Array.isArray(result.friends)){
      allContacts= result.friends;

    }
    else{

    }
      res.send(allContacts)
  } catch (error) {
      // console.log(error);
      res.status(500).send(error);
  }
});


app.post('/create-group', (req, res) => {
  var { groupName, contacts } = req.body;

  console.log('Received data:', { groupName, contacts });

  if (!groupName || !contacts) {
      return res.status(400).send('Group name and contacts are required');
  }

  var newGroup = {
      name: groupName,
      contacts,
  };

  res.status(201).send({ message: 'Group created successfully' , newGroup});
});
