const { MongoClient } = require('mongodb');

async function check() {
  const client = new MongoClient('mongodb://localhost:27017/novu');
  await client.connect();
  const db = client.db();
  const collections = await db.listCollections().toArray();
  console.log("Collections:", collections.map(c => c.name));
  client.close();
}
check().catch(console.error);
