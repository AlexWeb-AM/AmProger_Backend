import express from 'express'
import { getUser } from '../controller/userController.js'

const userRoutes = express.Router()

userRoutes.post('/get-user',getUser)

export default userRoutes