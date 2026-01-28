const express = require("express");
const router = express.Router();
const Wallet = require("../models/wallet.model");
const Transaction = require("../models/transaction.model");
const mongoose = require("mongoose");
const auth = require("../middlewares/auth");


router.post("/init", auth, async (req, res) => {
    try {
        const userId = req.user.userId;

        // Check if wallet already exists
        let wallet = await Wallet.findOne({ userId });
        if (wallet) {
            return res.json({ message: "Wallet already exists", wallet });
        }

        // Create wallet
        wallet = await Wallet.create({
            userId,
            balance: 0,
            currency: "INR",
            status: "active"
        });

        return res.json({ message: "Wallet created successfully", wallet });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// credit 
router.post('/credit',auth,async(req,res)=>{
    try{
        const userId = req.user.userId;
        const {amount,method} = req.body;

        if(!amount || amount <= 0){
            return res.status(400).json({message : "Invalid amount"});
        }
        const wallet = await Wallet.findOne({userId});
        if(!wallet){
            return res.status(404).json({message : "Wallet not found"});
        }
        wallet.balance += amount;
        await wallet.save();

        // create transaction method to save transaction
        const transaction = await Transaction.create({
            userId,
            type : "credit",
            amount,
            method : method || "system",
            status : "success"
        });
        transaction.save();
        return res.json({
            message : "Wallet Credited Successfully.",
            balance : wallet.balance,
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({message : "Internal server error"});
    }
});

// debit
router.post('/debit',auth,async(req,res)=>{
    try{
        const userId = req.user.userId;
        const {amount,method} = req.body;
        if(!amount || amount <= 0){
            return res.status(400).json({message : "Invalid amount"});
        }
        const wallet = await Wallet.findOne({userId});
        if(amount > wallet.balance){
            return res.status(400).json({message : "Insufficient balance"});
        }
        wallet.balance -= amount;
        await wallet.save();

        }catch(err){
            console.log(err);
        }
    });

router.get('/balance',auth,async(req,res)=>{
    try{
        const userId = req.user.userId;
        const wallet = await Wallet.findOne({userId});
        if(!wallet){
            return res.status(404).json({message : "Wallet not found"});
        }
        return res.json({balance : wallet.balance});
    }catch(err){
        console.log(err);
    }
});


router.get('/transactions',auth,async(req,res)=>{
    try{
        const userId = req.user.userId;
        const transactions = await Transaction.find({userId}).sort({createdAt : -1});
        return res.json({transactions});
    }catch(err){
        console.log(err);
    }
});

module.exports = router;