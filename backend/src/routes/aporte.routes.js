import { Router } from "express";
import { AportesController } from "../controllers/aportes.controller.js";
import { verifyActiveUserorAdmin, verifyActiveAdmin } from "../middlewares/auth.middleware.js";

const router = Router()

router.post('/', AportesController.create)

router.get('/', AportesController.getAll)
router.get('/:id', AportesController.getByAfiliado)
router.get('/:id', AportesController.getByFechaRegistro)

router.delete('/:id', AportesController.remove)

export default router