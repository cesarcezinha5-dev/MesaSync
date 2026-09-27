import { Router } from 'express';
import {
  criar,
  listar,
  buscarPorId,
  atualizarStatus,
  excluir
} from '../controllers/mesaController.js';

const router = Router();

router.post('/', criar);
router.get('/', listar);
router.get('/:id', buscarPorId);
router.patch('/:id/status', atualizarStatus);
router.delete('/:id', excluir);

export default router;