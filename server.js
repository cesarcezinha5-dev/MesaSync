import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import usuarioRoutes from './routes/usuarioRoutes.js';
import mesaRoutes from './routes/mesaRoutes.js';
import produtoRoutes from './routes/produtoRoutes.js';
import comandaRoutes from './routes/comandaRoutes.js'; 
import itemPedidoRoutes from './routes/itemPedidoRoutes.js';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/usuarios', usuarioRoutes);
app.use('/mesas', mesaRoutes);
app.use('/produtos', produtoRoutes);
app.use('/comandas', comandaRoutes);
app.use('/itens-pedido', itemPedidoRoutes);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});