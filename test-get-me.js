async function run() {
  const token = 'oJqXyLWLrzv4Y7FfDMa12rQWeprj4GwE'; // the valid session token from earlier
  const res = await fetch(`http://localhost:3000/v1/users/me`, {
    headers: { authorization: `Bearer ${token}` }
  });
  console.log("Status:", res.status);
  console.log("Body:", await res.text());
}
run().catch(console.error);
