import { Router } from 'express';
import { UserController } from "../controllers/user.controller.js";
import {
    verifyActiveToken,
    verifyActiveAdmin,
    verifyOwner
} from '../middlewares/auth.middleware.js'

const router = Router()

router.post('/login', UserController.login)
router.post('/register', verifyActiveAdmin, UserController.register)
router.get('/profile', verifyActiveToken, UserController.profile)

//rutas solo Admin
router.get('/',
    verifyActiveAdmin,
    UserController.findAll
)

// Ruta para actualizar un usuario
router.put('/:uid', verifyActiveAdmin, UserController.updateUser)

// Rutas específicas
router.put('/:uid/role', verifyActiveAdmin, UserController.updateRole)
router.put('/:uid/status', verifyActiveAdmin, UserController.updateUserStatus)
router.delete('/:uid', verifyActiveAdmin, UserController.deleteUser)

// Rutas de perfil personal
router.put('/:uid/profile', verifyActiveToken, verifyOwner, UserController.updatePersonalProfile)
router.put('/:uid/password', verifyActiveToken, verifyOwner, UserController.updatePassword)

export default router