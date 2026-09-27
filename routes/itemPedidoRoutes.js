import { Router } from 'express';
import {
  criar,
  listarPorComanda,
  buscarPorId,
  atualizar,
  alterarStatus
} from '../controllers/itemPedidoController.js';

const router = Router();

router.post('/', criar);
router.get('/comanda/:comandaId', listarPorComanda);
router.get('/:id', buscarPorId);
router.patch('/:id/status', alterarStatus);
router.patch('/:id', atualizar);

export default router;