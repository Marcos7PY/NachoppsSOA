const http = require('http');

async function doRequest(path, method = 'GET', body = null, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 8000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch(e) {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', reject);
    
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function run() {
  console.log("1. Autenticando...");
  const loginRes = await doRequest('/identidad/auth/login', 'POST', { email: 'admin@nachopps.pe', password: 'nachopps123' });
  if (loginRes.status !== 201 && loginRes.status !== 200) throw new Error("Fallo login");
  const token = loginRes.data.access_token;
  const usuarioId = loginRes.data.usuario.id;
  console.log("Login OK");

  console.log("2. Obteniendo productos...");
  const prodRes = await doRequest('/inventario/productos', 'GET', null, token);
  const productosArray = prodRes.data.productos || prodRes.data;
  if (!productosArray || productosArray.length === 0) throw new Error("No hay productos: " + JSON.stringify(prodRes.data));
  const productoId = productosArray[0].id;
  console.log("Producto:", productosArray[0].nombre);

  console.log("3. Obteniendo mesas...");
  const mesasRes = await doRequest('/mesas/mesas', 'GET', null, token);
  const mesasArray = mesasRes.data.mesas || mesasRes.data;
  if (!mesasArray || mesasArray.length === 0) throw new Error("No hay mesas: " + JSON.stringify(mesasRes.data));
  const mesaId = mesasArray[0].id;
  console.log("Mesa:", mesasArray[0].numero);

  console.log("4. Creando pedido...");
  const pedidoRes = await doRequest('/pedidos/pedidos', 'POST', {
    mesaId,
    usuarioId,
    items: [{ productoId, cantidad: 1, notas: "Test" }]
  }, token);
  console.log("Crear pedido status:", pedidoRes.status);
  console.log(pedidoRes.data);
}

run().catch(console.error);
