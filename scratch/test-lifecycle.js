const axios = require('axios');

const KONG_URL = 'http://localhost:8000';
const credentials = { email: 'admin@nachopps.pe', password: 'nachopps123' };

async function run() {
  console.log("=== INICIANDO PRUEBA DEL CICLO DE VIDA COMPLETO ===");
  try {
    // 1. Login
    const loginRes = await axios.post(`${KONG_URL}/identidad/auth/login`, credentials);
    const token = loginRes.data.access_token;
    const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };
    
    // 2. Obtener producto y mesa
    const prodRes = await axios.get(`${KONG_URL}/inventario/productos`, axiosConfig);
    const productos = prodRes.data.productos || prodRes.data;
    const productoId = productos[0].id;
    
    const mesasRes = await axios.get(`${KONG_URL}/mesas/mesas`, axiosConfig);
    const mesas = mesasRes.data.mesas || mesasRes.data;
    const mesaId = mesas[0].id;

    console.log(`\n--- CICLO 1: CLIENTE 1 SE SIENTA EN MESA ${mesas[0].numero} ---`);
    // 3. Crear Pedido 1
    console.log("Creando pedido 1...");
    const pedido1Res = await axios.post(`${KONG_URL}/pedidos/pedidos`, {
      mesaId: mesaId,
      items: [{ productoId, cantidad: 1, notas: "Sin aji" }]
    }, axiosConfig);
    const pedido1Id = pedido1Res.data.pedido.id;
    const pedido1Total = pedido1Res.data.pedido.total;
    console.log(`Pedido 1 creado: ${pedido1Id} (Total: ${pedido1Total})`);

    // 4. Verificar estados
    const mesaEstado1 = await axios.get(`${KONG_URL}/mesas/mesas/${mesaId}`, axiosConfig);
    console.log(`Estado de Mesa: ${mesaEstado1.data.estado} (Esperado: OCUPADA)`);
    
    const cuentaEstado1 = await axios.get(`${KONG_URL}/cuentas/cuentas/mesa/${mesaId}`, axiosConfig);
    const cuentaId = cuentaEstado1.data.id;
    console.log(`Estado de Cuenta: ${cuentaEstado1.data.estado} (Esperado: ABIERTA)`);

    // 5. Pagar Pedido 1
    console.log(`\n--- CICLO 2: CLIENTE 1 PAGA EL PEDIDO ---`);
    console.log("Registrando pago por el total...");
    
    // Primero, abrir turno de caja (ignorar si falla por ya estar abierto)
    try {
      await axios.post(`${KONG_URL}/caja/turnos/abrir`, { fondoInicial: 100 }, axiosConfig);
    } catch(e) {}

    // Pagar
    await axios.post(`${KONG_URL}/caja/pagos`, {
      pedidoId: pedido1Id,
      pagos: [{ monto: pedido1Total, metodo: "EFECTIVO", referencia: "Pago exacto" }]
    }, axiosConfig);
    console.log("Pago registrado exitosamente en Caja.");

    // Esperar a que el RabbitMQ procese el evento asíncrono
    console.log("Esperando 3 segundos a que los microservicios sincronicen eventos...");
    await new Promise(r => setTimeout(r, 3000));

    // 6. Verificar que la cuenta se cerró y la mesa se liberó
    const mesaEstado2 = await axios.get(`${KONG_URL}/mesas/mesas/${mesaId}`, axiosConfig);
    console.log(`Estado de Mesa Post-Pago: ${mesaEstado2.data.estado} (Esperado: LIBRE)`);
    
    const cuentaEstado2 = await axios.get(`${KONG_URL}/cuentas/cuentas/${cuentaId}`, axiosConfig);
    console.log(`Estado de Cuenta Post-Pago: ${cuentaEstado2.data.estado} (Esperado: CERRADA)`);

    console.log(`\n--- CICLO 3: NUEVO CLIENTE SE SIENTA EN LA MISMA MESA ---`);
    // 7. Crear Pedido 2
    console.log("Creando pedido 2...");
    const pedido2Res = await axios.post(`${KONG_URL}/pedidos/pedidos`, {
      mesaId: mesaId,
      items: [{ productoId, cantidad: 2 }]
    }, axiosConfig);
    console.log(`Pedido 2 creado exitosamente con ID: ${pedido2Res.data.pedido.id} 🎉`);
    
    console.log("\n✅ PRUEBA COMPLETADA SIN ERRORES.");

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
