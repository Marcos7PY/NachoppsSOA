const http = require('http');

const endpoints = [
  { path: '/identidad/auth', method: 'POST' },
  { path: '/mesas', method: 'GET' },
  { path: '/pedidos', method: 'POST' },
  { path: '/cuentas', method: 'GET' },
  { path: '/reservas', method: 'POST' }
];

function generateTraffic() {
  const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
  
  const options = {
    hostname: 'localhost',
    port: 8000,
    path: endpoint.path,
    method: endpoint.method,
    headers: {
      'Content-Type': 'application/json',
      // Mandamos un token falso para forzar errores 401 y validaciones
      'Authorization': 'Bearer fake-token-123'
    }
  };

  const req = http.request(options, (res) => {
    // console.log(`[Traffic] ${endpoint.method} ${endpoint.path} -> Status: ${res.statusCode}`);
  });

  req.on('error', (e) => {
    // ignorar
  });

  if (endpoint.method === 'POST') {
    req.write(JSON.stringify({ test: true }));
  }
  
  req.end();
}

console.log('Generador de tráfico iniciado. Presiona Ctrl+C para detener.');
// Enviar peticiones aleatorias cada 500ms
setInterval(generateTraffic, 500);
