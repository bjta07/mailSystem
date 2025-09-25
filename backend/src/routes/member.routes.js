import { Router } from "express";
import { MemberController } from "../controllers/member.controller.js";
import { verifyActiveAdmin, verifyActiveUserorAdmin } from "../middlewares/auth.middleware.js";

const router = Router()

//Registar miembro afiliado
router.post("/", verifyActiveUserorAdmin, MemberController.registerMember)

//Encontrar todos los miembros
router.get("/", verifyActiveUserorAdmin, MemberController.findAllMembers)
router.get("/ci/:ci", verifyActiveUserorAdmin, MemberController.findByCi)
router.get("/colegio/:colegio_id",verifyActiveUserorAdmin, MemberController.findByCity)

//Actualizar datos de registro
router.put("/:id",verifyActiveAdmin, MemberController.updateMember)

//Eliminar registros de miembros
router.delete("/:id", verifyActiveAdmin, MemberController.deleteMember)

export default router