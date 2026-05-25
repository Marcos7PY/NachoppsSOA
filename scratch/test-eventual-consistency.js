const axios = require('axios');

const KONG_URL = 'http://localhost:8000';
const credentials = { email: 'admin@nachopps.pe', password: 'nachopps123' };

async function run() {
  console.log("=== INICIANDO PRUEBA DE EVENTUAL CONSISTENCY ===");
  try {
    // 1. Login
    const loginRes = await axios.post(`${KONG_URL}/identidad/auth/login`, credentials);
    const token = loginRes.data.access_token;
    const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };
    
    // 2. Obtener producto y mesa libre
    const prodRes = await axios.get(`${KONG_URL}/inventario/productos`, axiosConfig);
    const productoId = prodRes.data.productos[0].id;
    
    const mesasRes = await axios.get(`${KONG_URL}/mesas/mesas`, axiosConfig);
    const mesaLibre = mesasRes.data.mesas.find(m => m.estado === 'LIBRE');
    if (!mesaLibre) throw new Error("No hay mesas libres para el test");
    const mesaId = mesaLibre.id;

    console.log(`Mesa elegida: ${mesaLibre.numero}`);

    // 3. Crear Pedido
    console.log("Creando pedido...");
    const pedidoRes = await axios.post(`${KONG_URL}/pedidos/pedidos`, {
      mesaId: mesaId,
      items: [{ productoId, cantidad: 1 }]
    }, axiosConfig);
    const pedidoId = pedidoRes.data.pedido.id;
    const pedidoTotal = pedidoRes.data.pedido.total;
    console.log(`Pedido creado: ${pedidoId}`);

    // 4. Pagar Pedido y verificar INMEDIATAMENTE
    console.log("Registrando pago y verificando estado de la mesa inmediatamente (Simulando Frontend UI)");
    
    // Primero, asegurar que hay turno de caja
    try {
      await axios.post(`${KONG_URL}/caja/turnos/abrir`, { fondoInicial: 100 }, axiosConfig);
    } catch(e) {}

    const inicioPago = Date.now();
    await axios.post(`${KONG_URL}/caja/pagos`, {
      pedidoId: pedidoId,
      pagos: [{ monto: pedidoTotal, metodo: "EFECTIVO" }]
    }, axiosConfig);
    const finPago = Date.now();
    console.log(`El endpoint de pago respondió en ${finPago - inicioPago}ms`);

    // Inmediatamente después de recibir el 200 OK, el frontend "refresca"
    const estadoInmediato = await axios.get(`${KONG_URL}/mesas/mesas/${mesaId}`, axiosConfig);
    console.log(`[0ms post-pago] Estado de Mesa visto por el UI: ${estadoInmediato.data.estado}`);
    const pedidoInmediato = await axios.get(`${KONG_URL}/pedidos/pedidos?mesaId=${mesaId}`, axiosConfig);
    const miPedidoInmediato = pedidoInmediato.data.pedidos.find(p => p.id === pedidoId);
    console.log(`[0ms post-pago] Estado de Pedido visto por el UI: ${miPedidoInmediato.estado}`);

    // Ahora esperamos un rato simulando el "Eventual Consistency"
    console.log("Esperando 1 segundo (tiempo para que RMQ procese)...");
    await new Promise(r => setTimeout(r, 1000));

    const estadoFinal = await axios.get(`${KONG_URL}/mesas/mesas/${mesaId}`, axiosConfig);
    console.log(`[1000ms post-pago] Estado de Mesa Final: ${estadoFinal.data.estado}`);
    const pedidoFinal = await axios.get(`${KONG_URL}/pedidos/pedidos?mesaId=${mesaId}`, axiosConfig);
    const miPedidoFinal = pedidoFinal.data.pedidos.find(p => p.id === pedidoId);
    console.log(`[1000ms post-pago] Estado de Pedido Final: ${miPedidoFinal.estado}`);

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
