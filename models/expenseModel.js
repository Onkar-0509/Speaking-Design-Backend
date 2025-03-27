import mongoose from "mongoose"



const expenseSchema=new mongoose.Schema({
    projectId:{type:String,required:true},
    name:{type:String,required:true},
    phoneNumber:{type:String},
    image:{type:String,default:""},
    category:{type:String,required:true},
    entryDate:{type:Date,default: () => new Date()},
    amount:{type:Number,required:true},
    totalPayment:{type:Number,required:true},
    paymentMethod: { type: String, required: true},
})

const Expense=mongoose.model("Expense",expenseSchema)

export default Expense;