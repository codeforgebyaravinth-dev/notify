const fetch = require('node-fetch');
async function run() {
  const res = await fetch('http://localhost:3000/v1/health-check');
  console.log("Health:", res.status);
}
run().catch(console.error);
