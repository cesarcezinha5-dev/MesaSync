import express from 'express';
import * as itemPedidoController from '../controllers/itemPedidoController.js';
import { autenticar, autorizar } from '../middlewares/auth.js';

const router = express.Router();

// Obriga o usuário a estar logado com o token JWT
router.use(autenticar);

// Rota para adicionar um item à comanda (POST /itens)
// Congela o preço e recalcula o total da comanda
router.post('/', itemPedidoController.adicionar);

// Rota para a cozinha atualizar o status do pedido (PATCH /itens/:id/status)
// Usamos PATCH em vez de PUT porque estamos alterando apenas 1 campo (status_item)
// Restringimos para que apenas COZINHA e GERENCIA possam alterar isso
router.patch('/:id/status', autorizar(['COZINHA', 'GERENCIA']), itemPedidoController.atualizarStatus);

export default router;