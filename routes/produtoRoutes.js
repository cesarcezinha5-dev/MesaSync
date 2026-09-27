import { Router } from 'express';
import * as produtoController from '../controllers/produtoController.js';

const router = Router();

router.post('/', produtoController.criar);
router.get('/', produtoController.listar);
router.get('/:id', produtoController.buscarPorId);
router.put('/:id', produtoController.atualizar);
router.delete('/:id', produtoController.excluir);

export default router;