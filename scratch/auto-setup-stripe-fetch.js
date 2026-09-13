const mongoose = require('mongoose');

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'process.env.STRIPE_SECRET_KEY || "sk_test_placeholder"';

async function stripeRequest(method, endpoint, data = null) {
  const url = `https://api.stripe.com/v1${endpoint}`;
  
  const headers = {
    'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
    'Content-Type': 'application/x-www-form-urlencoded',
    'Stripe-Version': '2024-04-10'
  };

  let body = undefined;
  if (data) {
    body = new URLSearchParams();
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'object' && value !== null) {
        for (const [subKey, subValue] of Object.entries(value)) {
          body.append(`${key}[${subKey}]`, subValue);
        }
      } else {
        body.append(key, value);
      }
    }
  }

  const response = await fetch(url, { method, headers, body });
  const result = await response.json();
  
  if (result.error) {
    throw new Error(result.error.message);
  }
  return result;
}

async function autoSetupStripe() {
  try {
    console.log('Connecting to local MongoDB...');
    await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/novu-db');
    const db = mongoose.connection.db;
    const organizations = db.collection('organizations');

    let org = await organizations.findOne({});

    if (!org) {
      console.error('No organization found in the database. Please create one first via the UI.');
      process.exit(1);
    }
    
    console.log(`Found organization: ${org.name} (ID: ${org._id})`);

    // 1. Create a Product
    console.log('Creating Stripe Product...');
    const product = await stripeRequest('POST', '/products', {
      name: 'Notify Managed Providers',
      description: 'Metered billing for SMS, Email, and Push integrations'
    });
    console.log(`✓ Product created (ID: ${product.id})`);

    // 2. Create a Metered Price
    console.log('Creating Metered Price...');
    const price = await stripeRequest('POST', '/prices', {
      product: product.id,
      unit_amount: 1, // $0.01 per message
      currency: 'usd',
      'recurring[usage_type]': 'metered',
      'recurring[interval]': 'month'
    });
    console.log(`✓ Price created (ID: ${price.id})`);

    // 3. Create a Customer
    console.log('Creating Stripe Customer...');
    const customer = await stripeRequest('POST', '/customers', {
      name: org.name,
      'metadata[novuOrganizationId]': org._id.toString()
    });
    console.log(`✓ Customer created (ID: ${customer.id})`);

    // 4. Create a Subscription
    console.log('Creating Metered Subscription for Customer...');
    const subscription = await stripeRequest('POST', '/subscriptions', {
      customer: customer.id,
      'items[0][price]': price.id
    });
    console.log(`✓ Subscription created (ID: ${subscription.id})`);

    // 5. Update Local Database
    console.log('Updating local organization record...');
    await organizations.updateOne(
      { _id: org._id },
      { 
        $set: { 
          stripeCustomerId: customer.id,
          apiServiceLevel: 'business'
        } 
      }
    );
    console.log(`✓ Organization updated in database!`);
    
    console.log('\n--- SETUP COMPLETE ---');
    console.log('You are now ready to test 1-Click Integrations locally!');

  } catch (error) {
    console.error('An error occurred during setup:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

autoSetupStripe();
