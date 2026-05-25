const axios = require('axios');

async function check() {
  try {
    const login = await axios.post('http://localhost:8000/identidad/auth/login', {
      email: 'admin@nachopps.pe',
      password: 'nachopps123'
    });
    const token = login.data.access_token;

    const res = await axios.get('http://localhost:8000/identidad/auditoria', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(res.data);
  } catch (e) {
    console.error(e.message);
    if (e.response) console.error(e.response.data);
  }
}
check();
