const { MongoClient } = require('mongodb');

async function check() {
  const client = new MongoClient('mongodb://localhost:27017/novu-db');
  await client.connect();
  const db = client.db();
  const collections = await db.listCollections().toArray();
  console.log("Collections:", collections.map(c => c.name));
  const session = await db.collection('session').find().sort({_id: -1}).limit(1).toArray();
  console.log("Found session:", JSON.stringify(session, null, 2));
  client.close();
}
check().catch(console.error);
