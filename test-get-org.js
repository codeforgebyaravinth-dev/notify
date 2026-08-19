const token = 'oJqXyLWLrzv4Y7FfDMa12rQWeprj4GwE';
const orgId = 'p8uTawR0pG2U0lYV'; // wait, I don't know the org id. Let's query it.
const { MongoClient } = require('mongodb');
async function run() {
  const c = new MongoClient('mongodb://localhost:27017');
  await c.connect();
  const db = c.db('novu-db');
  const org = await db.collection('organization').findOne({});
  console.log("Found org:", org);
  if (org) {
    const res = await fetch(`http://localhost:3000/v1/better-auth/organization/get-full-organization?organizationId=${org.id}`, {
      headers: { authorization: `Bearer ${token}` }
    });
    console.log("Status:", res.status);
    console.log("Body:", await res.text());
  }
  await c.close();
}
run().catch(console.error);
