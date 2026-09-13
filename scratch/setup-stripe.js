const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'process.env.STRIPE_SECRET_KEY || "sk_test_placeholder"';

async function stripeRequest(method, endpoint, data = null) {
  const url = `https://api.stripe.com/v1${endpoint}`;
  
  const headers = {
    'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
    'Content-Type': 'application/x-www-form-urlencoded',
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
    console.log('Automating Stripe Setup...');

    // 1. Create a Product
    console.log('1. Creating Stripe Product...');
    const product = await stripeRequest('POST', '/products', {
      name: 'Notify Managed Providers',
      description: 'Metered billing for SMS, Email, and Push integrations'
    });
    console.log(`   ✓ Product created (ID: ${product.id})`);

    // 2. Create a Metered Price
    console.log('2. Creating Metered Price...');
    const price = await stripeRequest('POST', '/prices', {
      product: product.id,
      unit_amount: 1, // $0.01 per message
      currency: 'usd',
      'recurring[usage_type]': 'metered',
      'recurring[interval]': 'month'
    });
    console.log(`   ✓ Price created (ID: ${price.id})`);

    // 3. Create a Customer
    console.log('3. Creating Stripe Customer...');
    const customer = await stripeRequest('POST', '/customers', {
      name: 'Local Test Organization',
    });
    console.log(`   ✓ Customer created (ID: ${customer.id})`);

    // 4. Create a Subscription
    console.log('4. Creating Metered Subscription for Customer...');
    const subscription = await stripeRequest('POST', '/subscriptions', {
      customer: customer.id,
      'items[0][price]': price.id
    });
    console.log(`   ✓ Subscription created (ID: ${subscription.id})`);

    console.log('\n======================================================');
    console.log('✅ STRIPE SETUP COMPLETE!');
    console.log('======================================================');
    console.log('Now, to link this test customer to your local database, run this command in your terminal:');
    console.log(`\nnode scratch/setup-stripe-test.js <YOUR_ORGANIZATION_ID> ${customer.id}\n`);

  } catch (error) {
    console.error('An error occurred during setup:', error);
  }
}

autoSetupStripe();
