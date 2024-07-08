import express from 'express'
import { Router } from 'express'
import { register , login , getuser , logout } from '../Controllers/userController.js'
import { isLoggedin } from '../Middlewares/authMiddleware.js'
const router = Router()

router.post('/register' , register)
router.post('/login' , login)
router.get('/me' , isLoggedin , getuser)
router.get('/logout' , logout)

export default router 