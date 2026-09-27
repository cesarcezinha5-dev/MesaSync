import { Router } from 'express';
import * as mesaController from '../controllers/mesaController.js';

const router = Router();

router.post('/', mesaController.criar);
router.get('/', mesaController.listar);
router.get('/:id', mesaController.buscarPorId);
router.patch('/:id/status', mesaController.atualizarStatus);
router.delete('/:id', mesaController.excluir);

export default router;