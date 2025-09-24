// mail.routes.js
import { Router } from "express"
import { MailController } from "../controllers/mail.controller.js"
import { verifyActiveUserorAdmin, verifyActiveAdmin, verifyOwner, verifyActiveToken } from "../middlewares/auth.middleware.js"

const router = Router()

// Crear correspondencia → User o Admin
router.post("/", verifyActiveUserorAdmin, MailController.create)

// Obtener todas / una → cualquier user autenticado
router.get("/", verifyActiveUserorAdmin, MailController.getAll)
router.get("/:id", verifyActiveUserorAdmin, MailController.getById)

// Actualizar → solo puede actualizar los registros que hizo el usuario 
router.put("/:id", verifyActiveToken, verifyOwner, MailController.update)

// Eliminar → solo Admin
router.delete("/:id", verifyActiveAdmin, MailController.remove)

export default router
