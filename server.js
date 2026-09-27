import express from 'express';
import usuarioRoutes from './routes/usuarioRoutes.js';
import mesaRoutes from './routes/mesaRoutes.js';
import produtoRoutes from './routes/produtoRoutes.js';


const app = express();
app.use(express.json());

app.use('/usuarios', usuarioRoutes);
app.use('/mesas', mesaRoutes);
app.use('/produtos', produtoRoutes);




app.listen(4000, () => {
    console.log('Servidor rodando na porta 4000');
});

