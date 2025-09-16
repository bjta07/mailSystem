import { Router } from "express";
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
    (req, res, next) => {
        console.log(req.headers.authorization ? 'Token presente': 'Sin token')
        next()
    }, verifyActiveAdmin, (req, res, next) => {
        next()
    }, UserController.findAll
)

router.put('/:uid/role', verifyActiveAdmin, UserController.updateRole)
router.put('/:uid/status', verifyActiveAdmin, UserController.updateUserStatus)
router.delete('/:uid', verifyActiveAdmin, UserController.deleteUser)
export default router