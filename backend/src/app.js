import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import userRouter from './routes/user.routes.js'
import authRoutes from './routes/auth.routes.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.urlencoded({ extended: true}))
app.use(express.static('public'))

app.use('/api/users', userRouter)


export default app
