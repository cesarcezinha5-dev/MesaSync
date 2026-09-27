import { Router } from 'express';
import {
  criar,
  listar,
  buscarPorId,
  alterarStatus
} from '../controllers/comandaController.js';

const router = Router();

router.post('/', criar);
router.get('/', listar);
router.get('/:id', buscarPorId);
router.patch('/:id/status', alterarStatus);

export default router;