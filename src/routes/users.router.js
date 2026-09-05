import { Router } from 'express';
import * as usersController from '../controllers/users.controller.js';

const router = Router();

// GET /api/users/workers  — Obtiene todos los prestadores
router.get('/workers', usersController.getWorkers);

export default router;
