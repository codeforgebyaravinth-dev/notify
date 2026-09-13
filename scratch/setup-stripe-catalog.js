const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'process.env.STRIPE_SECRET_KEY || "sk_test_placeholder"';

async function stripeRequest(method, endpoint, data = null) {
  const url = `https://api.stripe.com/v1${endpoint}`;
  
  const headers = {
    'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
    'Content-Type': 'application/x-www-form-urlencoded',
    'Stripe-Version': '2024-04-10' // Keep old API version to use legacy metered billing
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

async function getPaginatedData(endpoint) {
  let hasMore = true;
  let startingAfter = null;
  const items = [];

  while (hasMore) {
    const url = startingAfter ? `${endpoint}?starting_after=${startingAfter}` : endpoint;
    const result = await stripeRequest('GET', url);
    items.push(...result.data);
    hasMore = result.has_more;
    if (hasMore) {
      startingAfter = result.data[result.data.length - 1].id;
    }
  }
  return items;
}

async function setupCatalog() {
  try {
    console.log('--- STRIPE CATALOG AUTOMATION ---');
    console.log('Fetching existing products...');
    const products = await getPaginatedData('/products');
    
    console.log(`Found ${products.length} existing products. Archiving them...`);
    for (const product of products) {
      if (product.active) {
        await stripeRequest('POST', `/products/${product.id}`, { active: 'false' });
        console.log(`   Archived: ${product.name} (${product.id})`);
      }
    }
    
    console.log('\n--- CREATING PRO PLAN ---');
    const proProduct = await stripeRequest('POST', '/products', {
      name: 'Notify Pro',
      description: 'For growing teams'
    });
    console.log(`✓ Product created: Notify Pro (${proProduct.id})`);

    // Pro Monthly Base ($29)
    await stripeRequest('POST', '/prices', {
      product: proProduct.id,
      unit_amount: 2900,
      currency: 'usd',
      'recurring[interval]': 'month',
      lookup_key: 'pro_monthly',
      transfer_lookup_key: 'true'
    });
    console.log(`   ✓ Monthly Price created ($29/mo)`);

    // Pro Annual Base ($276)
    await stripeRequest('POST', '/prices', {
      product: proProduct.id,
      unit_amount: 27600,
      currency: 'usd',
      'recurring[interval]': 'year',
      lookup_key: 'pro_annual',
      transfer_lookup_key: 'true'
    });
    console.log(`   ✓ Annual Price created ($276/yr)`);

    // Pro Metered Runs ($0.001 per run)
    await stripeRequest('POST', '/prices', {
      product: proProduct.id,
      unit_amount_decimal: '0.1', // 0.1 cents = $0.001
      currency: 'usd',
      'recurring[usage_type]': 'metered',
      'recurring[interval]': 'month',
      lookup_key: 'pro_metered_runs',
      transfer_lookup_key: 'true'
    });
    console.log(`   ✓ Metered Price created for Runs ($1 per 1k)`);

    // Pro Metered Conversations ($0.05 per conversation)
    await stripeRequest('POST', '/prices', {
      product: proProduct.id,
      unit_amount: 5, // 5 cents = $0.05
      currency: 'usd',
      'recurring[usage_type]': 'metered',
      'recurring[interval]': 'month',
      lookup_key: 'pro_metered_conversations',
      transfer_lookup_key: 'true'
    });
    console.log(`   ✓ Metered Price created for Conversations ($0.05 ea)`);


    console.log('\n--- CREATING BUSINESS PLAN ---');
    const bizProduct = await stripeRequest('POST', '/products', {
      name: 'Notify Business',
      description: 'For scaling teams'
    });
    console.log(`✓ Product created: Notify Business (${bizProduct.id})`);

    // Business Monthly Base ($99)
    await stripeRequest('POST', '/prices', {
      product: bizProduct.id,
      unit_amount: 9900,
      currency: 'usd',
      'recurring[interval]': 'month',
      lookup_key: 'business_monthly',
      transfer_lookup_key: 'true'
    });
    console.log(`   ✓ Monthly Price created ($99/mo)`);

    // Business Annual Base ($948)
    await stripeRequest('POST', '/prices', {
      product: bizProduct.id,
      unit_amount: 94800,
      currency: 'usd',
      'recurring[interval]': 'year',
      lookup_key: 'business_annual',
      transfer_lookup_key: 'true'
    });
    console.log(`   ✓ Annual Price created ($948/yr)`);

    // Business Metered Runs ($0.0008 per run)
    await stripeRequest('POST', '/prices', {
      product: bizProduct.id,
      unit_amount_decimal: '0.08', // 0.08 cents = $0.0008
      currency: 'usd',
      'recurring[usage_type]': 'metered',
      'recurring[interval]': 'month',
      lookup_key: 'business_metered_runs',
      transfer_lookup_key: 'true'
    });
    console.log(`   ✓ Metered Price created for Runs ($0.80 per 1k)`);

    // Business Metered Conversations ($0.04 per conversation)
    await stripeRequest('POST', '/prices', {
      product: bizProduct.id,
      unit_amount: 4, // 4 cents = $0.04
      currency: 'usd',
      'recurring[usage_type]': 'metered',
      'recurring[interval]': 'month',
      lookup_key: 'business_metered_conversations',
      transfer_lookup_key: 'true'
    });
    console.log(`   ✓ Metered Price created for Conversations ($0.04 ea)`);

    console.log('\n======================================================');
    console.log('✅ STRIPE CATALOG FULLY SYNCED!');
    console.log('======================================================');

  } catch (error) {
    console.error('\nERROR:', error.message);
  }
}

setupCatalog();
