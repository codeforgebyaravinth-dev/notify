require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');

async function setupTestOrganization(organizationId, stripeCustomerId) {
  await mongoose.connect(process.env.MONGO_URL);
  
  const db = mongoose.connection.db;
  const organizations = db.collection('organizations');
  
  const result = await organizations.updateOne(
    { _id: new mongoose.Types.ObjectId(organizationId) },
    { 
      $set: { 
        stripeCustomerId: stripeCustomerId,
        apiServiceLevel: 'business'
      } 
    }
  );
  
  console.log(`Matched ${result.matchedCount} document(s) and modified ${result.modifiedCount} document(s).`);
  console.log(`Organization ${organizationId} updated with Stripe Customer ID and upgraded to 'business' tier!`);
  
  await mongoose.disconnect();
}

const orgId = process.argv[2];
const cusId = process.argv[3];

if (!orgId || !cusId) {
  console.error('Usage: node setup-stripe-test.js <Organization_ID> <Stripe_Customer_ID>');
  process.exit(1);
}

setupTestOrganization(orgId, cusId);
