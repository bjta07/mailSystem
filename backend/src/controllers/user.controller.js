import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { UserModel } from '../models/user.model.js'

// registrar usuario
const register = async (req, res) => {
    try {
        const { name, username, password, email, phone, ci, role, isActive } = req.body

        // Validación de campos requeridos
        if (!name || !username || !password || !email || !phone || !ci || !role) {
            return res.status(400).json({ ok: false, msg: 'Missing required fields' })
        }

        // verificar si ya existe el email
        const existingEmail = await UserModel.findOneByEmail(email)
        if (existingEmail) {
            return res.status(409).json({ ok: false, msg: 'Email already exists' })
        }

        // verificar si el username ya existe
        const existingUsername = await UserModel.findOneByUsername(username)
        if (existingUsername) {
            return res.status(409).json({ ok: false, msg: 'Username already exists' })
        }

        // encriptar contraseña
        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)

        // crear usuario
        const newUser = await UserModel.create({
            name,
            username,
            email,
            password: hashedPassword,
            phone,
            ci,
            role,
            isActive: isActive ?? false
        })

        // generar token
        const token = jwt.sign(
            {
                uid: newUser.uid,
                email: newUser.email,
                username: newUser.username,
                role: newUser.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        )

        return res.status(201).json({
            ok: true,
            msg: {
                token,
                user: {
                    uid: newUser.uid,
                    name: newUser.name,
                    username: newUser.username,
                    email: newUser.email,
                    ci: newUser.ci,
                    phone: newUser.phone,
                    role: newUser.role,
                    isActive: newUser.isActive
                }
            }
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ ok: false, msg: 'Server error' })
    }
}

// login usuario
const login = async (req, res) => {
    try {
        const { username, password } = req.body
        if (!username || !password) {
            return res.status(400).json({ error: 'Missing required fields' })
        }

        const user = await UserModel.findOneByUsername(username)
        if (!user) return res.status(404).json({ error: 'User not found' })

        if (!user.isActive) {
            return res.status(401).json({ error: 'User account is inactive' })
        }

        const isMatch = await bcryptjs.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid password' })
        }

        const token = jwt.sign(
            {
                uid: user.uid,
                email: user.email,
                username: user.username,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        )

        return res.json({
            token,
            user: {
                uid: user.uid,
                name: user.name,
                username: user.username,
                email: user.email,
                ci: user.ci,
                phone: user.phone,
                role: user.role,
                isActive: user.isActive
            }
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ ok: false, msg: 'Server error' })
    }
}

// perfil
const profile = async (req, res) => {
    try {
        const user = await UserModel.findOneByUsername(req.username)
        if (!user) return res.status(404).json({ ok: false, msg: 'User not found' })

        return res.json({
            ok: true,
            data: user
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ ok: false, msg: 'Server error' })
    }
}

// cambiar rol
const updateRole = async (req, res) => {
    try {
        const { uid } = req.params
        const { role } = req.body

        if (!role) {
            return res.status(400).json({ ok: false, msg: 'Role is required' })
        }

        if (req.uid === parseInt(uid)) {
            return res.status(400).json({ ok: false, msg: 'You cannot change your own role' })
        }

        const user = await UserModel.findOneByUid(uid)
        if (!user) return res.status(404).json({ ok: false, msg: 'User not found' })

        const updatedUser = await UserModel.updateRole(uid, role)

        return res.json({
            ok: true,
            data: updatedUser,
            msg: 'User role updated successfully'
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ ok: false, msg: 'Server error' })
    }
}

// activar/desactivar usuario
const updateUserStatus = async (req, res) => {
    try {
        const { uid } = req.params

        if (req.uid === parseInt(uid)) {
            return res.status(403).json({ ok: false, msg: 'You cannot change your own status' })
        }

        const user = await UserModel.findOneByUid(uid)
        if (!user) return res.status(404).json({ ok: false, msg: 'User not found' })

        const updatedUser = await UserModel.updateStatus(uid)

        return res.json({
            ok: true,
            data: updatedUser,
            msg: `User ${updatedUser.isActive ? 'activated' : 'deactivated'} successfully`
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ ok: false, msg: 'Server error' })
    }
}

// eliminar usuario
const deleteUser = async (req, res) => {
    try {
        const { uid } = req.params

        if (req.uid === parseInt(uid)) {
            return res.status(403).json({ ok: false, msg: 'You cannot delete your own account' })
        }

        const user = await UserModel.findOneByUid(uid)
        if (!user) return res.status(404).json({ ok: false, msg: 'User not found' })

        const deletedUser = await UserModel.deleteUser(uid)

        return res.json({
            ok: true,
            data: { uid, name: deletedUser.name },
            msg: 'User deleted successfully'
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ ok: false, msg: 'Server error' })
    }
}

// listar todos los usuarios
const findAll = async (req, res) => {
    try {
        const users = await UserModel.findAll()
        return res.json({ ok: true, data: users, msg: 'Users retrieved successfully' })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ ok: false, msg: 'Server error' })
    }
}

export const UserController = {
    register,
    login,
    profile,
    findAll,
    updateRole,
    updateUserStatus,
    deleteUser
}
