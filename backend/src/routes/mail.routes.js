// mail.routes.js
import { Router } from "express"
import { MailController } from "../controllers/mail.controller.js"
import { verifyActiveUserorAdmin, verifyActiveAdmin } from "../middlewares/auth.middleware.js"

const router = Router()

// Crear correspondencia → User o Admin
router.post("/", verifyActiveUserorAdmin, MailController.create)

// Obtener todas / una → cualquier user autenticado
router.get("/", verifyActiveUserorAdmin, MailController.getAll)
router.get("/:id", verifyActiveUserorAdmin, MailController.getById)

// Actualizar → cualquier usuario autenticado
router.put("/:id", verifyActiveUserorAdmin, MailController.update)

// Eliminar → solo Admin
router.delete("/:id", verifyActiveAdmin, MailController.remove)

export default router
