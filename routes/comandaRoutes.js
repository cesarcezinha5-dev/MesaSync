import express from 'express';
import * as comandaController from '../controllers/comandaController.js';
import { autenticar } from '../middlewares/auth.js'; // Importa o "segurança"

const router = express.Router();

// Todas as rotas de comanda precisam de autenticação
router.use(autenticar);

// Rota para criar/abrir uma nova comanda (POST /comandas)
// Vai usar a regra: verifica se mesa está livre e muda para 'O'
router.post('/', comandaController.abrir);

// Rota para buscar uma comanda específica por ID (GET /comandas/:id)
router.get('/:id', comandaController.buscarPorId);

// Rota para deletar/fechar uma comanda (DELETE /comandas/:id)
// Vai usar a regra: muda a comanda para 'F' e libera a mesa para 'L'
router.delete('/:id', comandaController.fechar);

export default router;