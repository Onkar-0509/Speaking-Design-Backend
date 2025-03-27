import express from "express"
import { addExpense, login, addProject, projectsName,expenseData, ExpenseUpdatation, updatedHistory } from "../controllers/userController.js"
import auth from "../middlewares/auth.js"
import upload from "../middlewares/multer.js"

const router=express.Router()

router.post('/login',login)
router.post('/add-project',auth,addProject)
router.get('/projects',auth,projectsName)
router.post('/expenses',upload.single('image'),auth,addExpense)
router.post('/expense-data',auth,expenseData)
router.post('/update-expense',upload.single('image'),auth,ExpenseUpdatation)
router.post('/updatedData',auth,updatedHistory)
export default router