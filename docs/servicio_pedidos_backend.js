const express = require('express');
const app = express();
const PORT = 8080;

app.use(express.json());

app.get('/api/pedidos', (req, res) => {
  res.json({ message: "Listado de pedidos" });
});


app.post('/api/pedidos', (req, res) => {
  res.json({ message: "Pedido creado" });
});


app.get('/api/pedidos/:id', (req, res) => {
  res.json({ message: `Detalle del pedido ${req.params.id}` });
});


app.patch('/api/pedidos/:id/estado', (req, res) => {
  res.json({ message: `Estado del pedido ${req.params.id} actualizado` });
});

app.listen(PORT, () => {
  console.log(`Backend básico escuchando en el puerto ${PORT}`);
});
