import { Router } from "express";
import { AportesController } from "../controllers/aportes.controller.js";
import { verifyActiveUserorAdmin, verifyActiveAdmin } from "../middlewares/auth.middleware.js";
import multer from "multer"

const router = Router()
const upload = multer({ dest: "documents/" })

router.post('/', verifyActiveUserorAdmin, AportesController.create)
router.post('/bulk-upload', verifyActiveUserorAdmin, upload.single("file"), AportesController.bulkUpload)

router.get('/', verifyActiveUserorAdmin, AportesController.getAll)
router.get('/afiliado/:id',verifyActiveUserorAdmin, AportesController.getByAfiliado)
router.get('/:id',verifyActiveUserorAdmin, AportesController.getByFechaRegistro)
router.get('/anio/:anio', verifyActiveUserorAdmin, AportesController.getByAnio)
router.get('/anios-aportes', verifyActiveUserorAdmin, AportesController.getYearsAndAportes
)

router.put('/:id', verifyActiveAdmin, AportesController.update)
router.delete('/:id',verifyActiveAdmin, AportesController.remove)

export default router