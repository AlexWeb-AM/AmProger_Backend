import express from 'express';
import { login, register, verifyEmail } from '../controller/authController.js';

const authRouter = express.Router();

authRouter.post('/login', login);
authRouter.post('/register', register);
authRouter.post('/verify-email',verifyEmail)

export default authRouter;
