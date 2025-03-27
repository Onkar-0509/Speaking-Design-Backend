import jwt from "jsonwebtoken"
import Expense from "../models/expenseModel.js";
import Projects from "../models/projectNamesModel.js";
import uploadOnCloudinary from '../config/cloudinary.js'
import UpdateExpense from "../models/updateExpense.js";
import { v2 as cloudinary } from "cloudinary"

const login = async (req, res) => {
    try {

        const { email, password } = req.body;

        if (email === process.env.EMAIL && password === process.env.PASSWORD) {


            const token = jwt.sign(email + password, process.env.JWT_SECRET)

            res.status(200).json({
                success: true,
                token
            })

        }
        else {
            res.status(404).json({
                success: false,
                message: "Invalid credientials"
            })
        }




    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const addProject = async (req, res) => {
    try {

        const { projectName, projectDate, location } = req.body


        const projectData = new Projects({
            projectName,
            projectDate,
            location
        })

        await projectData.save()

        res.status(200).json({
            success: true,
            message: "Project Added",
        })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const projectsName = async (req, res) => {
    try {
        const projectdata = await Projects.find({})
        res.status(200).json({
            success: true,
            projectdata
        })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}



const addExpense = async (req, res) => {
    try {
        const {
            projectName,
            name,
            phoneNumber,
            amount,
            totalPayment,
            category,
            entryDate,
            paymentMethod,
        } = req.body;

        // Check if a file was uploaded
        const imageFile = req.file ? req.file.path : null;



        // Find the project by name
        const project = await Projects.findOne({ projectName });
        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        // Upload image to Cloudinary if a file was uploaded
        let imageUrl = null;
        if (imageFile) {
            const imageUpload = await uploadOnCloudinary(imageFile);
            if (imageUpload) {
                imageUrl = imageUpload.secure_url;
            } else {
                console.error("Failed to upload image to Cloudinary");
            }
        }


        // Create new expense entry
        const expenseData = new Expense({
            projectId: project._id, // Correctly assigning the project ID
            name,
            phoneNumber,
            amount,
            totalPayment,
            category,
            entryDate,
            paymentMethod,
            image: imageUrl, // Use the Cloudinary URL or null if no image was uploaded
        });

        // Save the expense data to the database
        await expenseData.save();

        const updateHistoryData=new UpdateExpense({
            expenseId:expenseData._id,
            amount:expenseData.amount,
            totalPayment:expenseData.totalPayment,
            entryDate:expenseData.entryDate,
            paymentMethod:expenseData.paymentMethod,
            image:imageUrl
        })

        await updateHistoryData.save()

        // Send success response
        res.status(201).json({
            success: true,
            message: "Expense Added",
            data: expenseData, // Optionally include the saved expense data in the response
        });
    } catch (error) {
        console.error("Error adding expense:", error.message);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



const expenseData = async (req, res) => {
    try {
        const { projectId } = req.body;

        const expenses = await Expense.find({ projectId })

        res.status(200).json({
            success: true,
            expenses
        })


    } catch (error) {
        console.error("Error getting an  expense:", error.message);
        res.status(500).json({
            success: false,
            message: error.message
        });

    }
}

const ExpenseUpdatation = async (req, res) => {
    try {
        const { expenseId, amount, entryDate, paymentMethod } = req.body;
        const imageFile = req.file ? req.file.path : null;


        

        // Upload image to Cloudinary if a file was uploaded
        let imageUrl = null;
        if (imageFile) {
            const imageUpload = await uploadOnCloudinary(imageFile);
            if (imageUpload) {
                imageUrl = imageUpload.secure_url;
            } else {
                console.error("Failed to upload image to Cloudinary");
            }
        }


        const oldData = await Expense.findById(expenseId);
        if (!oldData) {
            return res.status(404).json({
                success: false,
                message: "Expense not found"
            });
        }

        const data = new UpdateExpense({
            expenseId,
            amount,
            entryDate,
            paymentMethod,
            image:imageUrl
        });

        await data.save();

        const updatedAmount = parseInt(amount) + parseInt(oldData.amount);

        // Update the expense with the new data
        const updateData = await Expense.findByIdAndUpdate(expenseId, {
            amount:updatedAmount,
            entryDate,
            paymentMethod,
            image: imageUrl || null
        }, { new: true });


        res.status(201).json({
            success: true,
            message: "Expense Updated",
            data: updateData
        });

    } catch (error) {
        console.error("Error updating expense:", error.message);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


const updatedHistory = async (req, res) => {
    try {
        const { expenseId } = req.body

        const updatedHistory = await UpdateExpense.find({ expenseId })

        res.status(201).json({
            success: true,
            updatedHistory
        })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            success: false,
            message: error.message
        })

    }
}



export { login, addProject, projectsName, addExpense, expenseData, ExpenseUpdatation, updatedHistory }