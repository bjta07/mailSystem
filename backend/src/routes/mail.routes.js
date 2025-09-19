// mail.routes.js
import { Router } from "express"
import { MailController } from "../controllers/mail.controller.js"
import { verifyActiveUserorAdmin, verifyActiveAdmin } from "../middlewares/auth.middleware.js"

const router = Router()

// Crear correspondencia → User o Admin
router.post("/register", verifyActiveUserorAdmin, MailController.create)

// Obtener todas / una → cualquier user autenticado
router.get("/", verifyActiveUserorAdmin, MailController.getAll)
router.get("/:id", verifyActiveUserorAdmin, MailController.getById)

// Editar / Eliminar → solo Admin
router.put("/:id", verifyActiveAdmin, MailController.update)
router.delete("/:id", verifyActiveAdmin, MailController.remove)

export default router
