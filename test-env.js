const token = 'oJqXyLWLrzv4Y7FfDMa12rQWeprj4GwE';
fetch('http://localhost:3000/v1/environments', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
}).then(res => res.json()).then(console.log).catch(console.error);
