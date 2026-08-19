const fetch = require('node-fetch');
async function run() {
  const token = '863CGTYKgzcDKtrcXoLm0UuI5un1DfpE'; // from the user's log
  const res = await fetch(`http://localhost:3000/v1/organizations`, {
    headers: { authorization: `Bearer ${token}` }
  });
  console.log("Status:", res.status);
  console.log("Body:", await res.text());
}
run().catch(console.error);
