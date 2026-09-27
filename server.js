import express from 'express';
import usuarioRoutes from './routes/usuarioRoutes.js';
import mesaRoutes from './routes/mesaRoutes.js';
import produtoRoutes from './routes/produtoRoutes.js';

// 1. Adição das novas importações 
import authRoutes from './routes/authRoutes.js';
import comandaRoutes from './routes/comandaRoutes.js';
import itemPedidoRoutes from './routes/itemPedidoRoutes.js';

const app = express();
app.use(express.json());

// 2. Registro das rotas
app.use('/auth', authRoutes);
app.use('/usuarios', usuarioRoutes);
app.use('/mesas', mesaRoutes);
app.use('/produtos', produtoRoutes);
app.use('/comandas', comandaRoutes);
app.use('/itens', itemPedidoRoutes);

app.listen(4000, () => {
    console.log('Servidor rodando na porta 4000');
});