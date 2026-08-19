const { auth } = require('./enterprise/packages/auth/dist/better-auth.config.js');
async function run() {
  const token = 'iN7mzFc2QOl0zkMXfLQmUG12z7JUq19k'; // from previous run
  console.log("Token:", token);
  
  try {
    const s2 = await auth.api.getSession({ headers: { authorization: `Bearer ${token}` } });
    console.log("Plain Object Session:", !!s2);
  } catch (e) { console.log("Plain Object Error", e.message); }
}
run().catch(console.error);
