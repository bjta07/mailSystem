import jwt from 'jsonwebtoken'

//Verificar token
export const verifyToken = (req, res, next) => {
    let token = req.headers.authorization

    if (!token) {
        return res.status(401).json({
            ok: false,
            error: 'Token not provided'
        })
    }

    token = token.split(' ')[1]

    if (!token) {
        return res.status(401).json({
            ok: false,
            error: 'Token format is invalid'
        })
    }

    try {
        const { uid, email, username, role } = jwt.verify(
            token,
            process.env.JWT_SECRET
        )
        req.uid = uid
        req.email = email
        req.username = username
        req.role = role
        next()
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                ok: false,
                error: 'Token has expired'
            })
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                ok: false,
                error:'Invalid token'
            })
        }
        return res.status(401).json({
            ok: false,
            error: 'Token verification failed'
        })
    }
}

//Verificar usuario admin
export const verifyAdmin = (req, res, next) => {
    if (!req.role) {
        return res.status(401).json({
            ok: false,
            error: 'Authentication required'
        })
    }

    if (req.role === 1) {
        return next()
    }

    return res.status(403).json({
        ok: false,
        error: 'Access denied. Admin role required'
    })
}

//Verificar usuario y admin
export const verifyUserOrAdmin = (req, res, next) => {
    if ((!req.role)) {
        return res.status(401).json({
            ok: false,
            error: 'Authentication required'
        })
    }

    if (req.role === 2 || req.role === 1) {
        return next()
    }
    return res.status(403).json({
        ok: false,
        error: 'Access denied. User or Admin role required'
    })
}

//Verificar usuario
export const verifyUser = (req, res, next) => {
    if (!req.role) {
        return res.status(401).json({
            ok: false,
            error: 'Authentication required'
        })
    }

    if (req.role === 2 || req.role === 1){
        return next()
    }
    return res.status(403).json({
        ok: false,
        error: 'Access denied. Valid user role required'
    })
}

//Veriricar cuenta
export const verifyOwner = (req, res, next) => {
    if (!req.uid) {
        return res.status(401).json({
            ok: false,
            error: 'Authentication required'
        })
    }
    const { uid } = req.params

    if (req.uid === uid || req.role === 1) {
        return next()
    }

    return res.status(403).json({
        ok: false,
        error: 'Access denied. You can only access your own resources'
    })
}

//Verificar si el usuario tiene la cuenta activa
export const verifyActiveUser = async (req, res, next) => {
    try {
        if (!req.email) {
            return res.status(401).json({
                ok: false,
                error: 'Authentication required'
            })
        }
        const { UserModel } = await import ('../models/user.model.js')
        const user = await UserModel.findOneByUsername(req.username)

        if (!user) {
            return res.status(404).json({
                ok: false,
                error: 'User not found'
            })
        }

        if (!user.isActive) {
            return res.status(403).json({
                ok: false,
                error: 'User account is inactive'
            })
        }
        next()
    } catch (error) {
        return res.status(500).json({
            ok: false,
            error: 'Server error during user verification'
        })
    }
}

export const verifyActiveToken = [verifyToken, verifyActiveUser]
export const verifyActiveAdmin = [verifyToken, verifyActiveUser, verifyAdmin]
export const verifyActiveUserorAdmin = [
    verifyToken,
    verifyActiveUser,
    verifyUserOrAdmin
]
