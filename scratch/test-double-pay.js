const axios = require('axios');

const KONG_URL = 'http://localhost:8000';
const credentials = { email: 'admin@nachopps.pe', password: 'nachopps123' };

async function run() {
  console.log("=== INICIANDO PRUEBA DE DOBLE PAGO ===");
  try {
    const loginRes = await axios.post(`${KONG_URL}/identidad/auth/login`, credentials);
    const token = loginRes.data.access_token;
    const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };
    
    const prodRes = await axios.get(`${KONG_URL}/inventario/productos`, axiosConfig);
    const productoId = prodRes.data.productos[0].id;
    
    const mesasRes = await axios.get(`${KONG_URL}/mesas/mesas`, axiosConfig);
    const mesaLibre = mesasRes.data.mesas.find(m => m.estado === 'LIBRE');
    const mesaId = mesaLibre.id;

    const pedidoRes = await axios.post(`${KONG_URL}/pedidos/pedidos`, {
      mesaId: mesaId,
      items: [{ productoId, cantidad: 1 }]
    }, axiosConfig);
    const pedidoId = pedidoRes.data.pedido.id;
    const pedidoTotal = pedidoRes.data.pedido.total;

    console.log(`Pedido creado: ${pedidoId}, Total: ${pedidoTotal}`);
    
    // Pago 1
    console.log("Registrando Pago 1...");
    const res1 = await axios.post(`${KONG_URL}/caja/pagos`, {
      pedidoId: pedidoId,
      pagos: [{ monto: pedidoTotal, metodo: "EFECTIVO" }]
    }, axiosConfig);
    console.log("Pago 1 OK", res1.data);

    // Pago 2 (Simulando doble click o recarga)
    console.log("Registrando Pago 2 Inmediatamente...");
    try {
      const res2 = await axios.post(`${KONG_URL}/caja/pagos`, {
        pedidoId: pedidoId,
        pagos: [{ monto: pedidoTotal, metodo: "EFECTIVO" }]
      }, axiosConfig);
      console.log("Pago 2 OK - ESTO ES UN ERROR, DEBERIA SER RECHAZADO", res2.data);
    } catch(e) {
      console.log("Pago 2 Rechazado exitosamente:", e.response ? e.response.data : e.message);
    }

  } catch (error) {
    console.error("❌ ERROR EN LA PRUEBA:");
    if (error.response) {
      console.error(error.response.status, error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

run();
