

async function testAuth() {
  const loginRes = await fetch('http://127.0.0.1:3000/v1/better-auth/sign-in/email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Origin': 'http://127.0.0.1:4201' },
    body: JSON.stringify({ email: "test2@test.com", password: "password" })
  });

  const loginData = await loginRes.json();
  if (!loginData.token) {
    console.log("LOGIN FAILED:", loginData);
    return;
  }
  
  console.log("Logged in! Token:", loginData.token);

  const envRes = await fetch('http://127.0.0.1:3000/v1/environments', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${loginData.token}`
    }
  });

  console.log("Environments Status:", envRes.status);
  const envData = await envRes.json();
  console.log("Environments Data:", envData);
}

testAuth().catch(console.error);
