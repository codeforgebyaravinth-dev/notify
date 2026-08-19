const { auth } = require('./enterprise/packages/auth/dist/better-auth.config.js');
async function run() {
  const token = 'oJqXyLWLrzv4Y7FfDMa12rQWeprj4GwE'; // newest token from check-session4.js
  console.log("Token:", token);
  
  // Try passing a native Request object
  const req = new Request('http://localhost:3000/v1/better-auth/get-session', {
    headers: { 'authorization': `Bearer ${token}` }
  });
  
  try {
    const s3 = await auth.api.getSession({ request: req });
    console.log("Request Object Session:", !!s3, s3);
  } catch (e) { console.log("Request Object Error", e.message); }
}
run().catch(console.error);
