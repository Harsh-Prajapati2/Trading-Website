const express = require('express');
const router = express.Router();
const kyc = require('../models/kyc.model');
const mongoose = require('mongoose');


const auth = require("../middlewares/auth"); // middleware


router.post("/submit", auth, async(req, res) => {
    try {
        const {
            fullName,
            dob,
            gender,
            address,
            pan,
            aadhar,
            city,
            pincode,
            state,
            contry,
            bankName,
            accountNo,
            ifsc
        } = req.body;

        // Basic validation
        if (!fullName || !dob || !pan || !aadhar) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Extract userId from token
        const userId = req.user.userId;

        const kycData = {
            userId,
            fullName,
            dob,
            gender,
            address,
            pan,
            aadhar,
            city,
            pincode,
            state,
            country: contry,
            bankName,
            accountNo,
            ifsc,
            status: "pending",
            createdAt: new Date()
        };

        await kyc.findOneAndUpdate(
            { userId },
            kycData,
            { upsert: true, new: true }
        );

        return res.status(200).json({
            message: "KYC submitted successfully",
            status: "pending"
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

router.get("/submit/status", auth, async(req, res) => {
    try {
        const userId = req.user.userId;

        const kycData = await kyc.findOne({ userId });

        if (!kycData) {
            return res.json({ status: "not_submitted" });
        }

        return res.json({ status: kycData.status });

    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;