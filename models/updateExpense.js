import mongoose from "mongoose";

const updateExpenseSchema = new mongoose.Schema({
    expenseId: { type: String, required: true },
    amount: { type: Number, required: true },
    entryDate: { type: Date, default: () => new Date()},
    paymentMethod:{type:String,required:true},
    image: { type: String, default: "" }
});

const UpdateExpense = mongoose.model("UpdateExpense", updateExpenseSchema);

export default UpdateExpense;
