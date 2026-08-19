const mongoose = require('mongoose');

async function check() {
  await mongoose.connect('mongodb://localhost:27017/novu-db');
  
  const token = 'oJqXyLWLrzv4Y7FfDMa12rQWeprj4GwE';
  
  const db = mongoose.connection;
  
  try {
    const sessionData = await db.collection('session').findOne({ token });
    console.log("sessionData:", sessionData);
  } catch (e) {
    console.error("Error:", e);
  }
  
  await mongoose.disconnect();
}
check();
