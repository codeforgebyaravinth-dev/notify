const { MongoClient } = require('mongodb');

async function check() {
  const client = new MongoClient('mongodb://localhost:27017/novu');
  await client.connect();
  const db = client.db();
  const session = await db.collection('session').findOne({});
  console.log("Found session:", session);
  client.close();
}
check().catch(console.error);
