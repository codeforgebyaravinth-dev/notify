const mongoose = require('mongoose');
const Stripe = require('stripe');

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'process.env.STRIPE_SECRET_KEY || "sk_test_placeholder"';
const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2024-04-10' });

async function autoSetupStripe() {
  try {
    console.log('Connecting to local MongoDB...');
    await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/novu-db');
    const db = mongoose.connection.db;
    const organizations = db.collection('organizations');

    // Find the first organization (or use one passed via args)
    const orgIdArg = process.argv[2];
    let org;
    if (orgIdArg) {
      org = await organizations.findOne({ _id: new mongoose.Types.ObjectId(orgIdArg) });
    } else {
      org = await organizations.findOne({});
    }

    if (!org) {
      console.error('No organization found in the database. Please create one first via the UI.');
      process.exit(1);
    }
    
    console.log(`Found organization: ${org.name} (ID: ${org._id})`);

    // 1. Create a Product
    console.log('Creating Stripe Product...');
    const product = await stripe.products.create({
      name: 'Notify Managed Providers',
      description: 'Metered billing for SMS, Email, and Push integrations',
    });
    console.log(`✓ Product created (ID: ${product.id})`);

    // 2. Create a Metered Price
    console.log('Creating Metered Price...');
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: 1, // $0.01 per message
      currency: 'usd',
      recurring: {
        usage_type: 'metered',
        interval: 'month',
      },
    });
    console.log(`✓ Price created (ID: ${price.id})`);

    // 3. Create a Customer
    console.log('Creating Stripe Customer...');
    const customer = await stripe.customers.create({
      name: org.name,
      metadata: {
        novuOrganizationId: org._id.toString(),
      }
    });
    console.log(`✓ Customer created (ID: ${customer.id})`);

    // 4. Create a Subscription
    console.log('Creating Metered Subscription for Customer...');
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: price.id }],
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
    console.log('Run your API and Worker, and activate a Notify provider in the dashboard.');

  } catch (error) {
    console.error('An error occurred during setup:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

autoSetupStripe();
