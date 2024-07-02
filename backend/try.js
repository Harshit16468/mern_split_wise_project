const { MongoClient, ServerApiVersion } = require('mongodb');
const { escape: encodeURIComponent } = require('querystring');

const rawPassword = 'Harshit@123';
const encodedPassword = encodeURIComponent(rawPassword);

const uri = `mongodb+srv://harshit:${encodedPassword}@cluster0.csw5jmw.mongodb.net/split?retryWrites=true&w=majority&appName=Cluster0`;
const dbName = 'split';
async function fetchpeople() {
  let client;
  try {
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(dbName);
    const groups = await db.collection('split').find({}).toArray();
    console.log('All groups:');
    console.log(groups);
  } catch (err) {
    console.error('Error fetching groups:', err);
  } finally {
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  }
}


async function fetchGroups() {
  let client;
  try {
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(dbName);
    const groups = await db.collection('groups').find({}).toArray();
    console.log('All groups:');
    console.log(groups);
  } catch (err) {
    console.error('Error fetching groups:', err);
  } finally {
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  }
}
async function clearGroupsCollection() {
  let client;
  try {
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(dbName);
    const result = await db.collection('groups').deleteMany({});
    console.log(`Deleted ${result.deletedCount} documents from the groups collection`);

  } catch (err) {
    console.error('Error clearing groups collection:', err);
  } finally {
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  }
}
//clearGroupsCollection();

fetchpeople();
fetchGroups();
