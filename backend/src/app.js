import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import userRouter from './routes/user.routes.js'
import mailRouter from './routes/mail.routes.js'
import memberRouter from './routes/member.routes.js'

dotenv.config()

const app = express()

// Configuración de CORS
app.use(cors({
    origin: 'http://localhost:3000', // URL de tu frontend
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use(express.static('public'))

// Rutas
// Todas las rutas de autenticación y usuarios bajo /api/users
app.use('/api/users', userRouter)
app.use('/api/mail', mailRouter )
app.use('/api/afiliados', memberRouter)

// Middleware para manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Algo salió mal!',
        message: err.message
    });
});

export default app
