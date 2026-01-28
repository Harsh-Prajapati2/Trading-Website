const mongoose = require('mongoose');


const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    type: {
        type: String,
        enum: ["credit", "debit","withdraw"],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    method: {
        type: String,
        enum: ["upi", "bank", "cash", "bonus", "admin", "system"],
        default: "system"
    },
    referenceId: {
        type: String, // Example: paymentId, UTR, bank_ref
        default: null
    },
    status: {
        type: String,
        enum: ["pending", "success", "failed"],
        default: "success"
    },
    remark: {
        type: String,
        default: ""
    }
}, { timestamps: true });

module.exports = mongoose.model("Transaction", transactionSchema);