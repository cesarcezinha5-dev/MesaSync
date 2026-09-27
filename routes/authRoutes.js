import express from 'express';
import * as authController from '../controllers/authController.js';

const router = express.Router();

// POST /auth/login (Rota pública, não tem middleware bloqueando)
router.post('/login', authController.login);

export default router;