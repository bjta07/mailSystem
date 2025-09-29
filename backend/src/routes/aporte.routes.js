import { Router } from "express";
import { AportesController } from "../controllers/aportes.controller.js";
import { verifyActiveUserorAdmin, verifyActiveAdmin } from "../middlewares/auth.middleware.js";

const router = Router()

router.post('/', verifyActiveUserorAdmin, AportesController.create)

router.get('/', verifyActiveUserorAdmin, AportesController.getAll)
router.get('/afiliado/:id',verifyActiveUserorAdmin, AportesController.getByAfiliado)
router.get('/:id',verifyActiveUserorAdmin, AportesController.getByFechaRegistro)

router.put('/:id', verifyActiveAdmin, AportesController.update)
router.delete('/:id',verifyActiveAdmin, AportesController.remove)

export default router