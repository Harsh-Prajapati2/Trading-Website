const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

router.post("/register",(async(req,res)=>{
    try {
        const {name,mobileNo,email,password} = req.body;

        // Validate required fields
        if(!name || !mobileNo || !email || !password) {
            return res.status(400).json({error : "All fields are required"});
        }

        // Check if user already exists
        const userExists = await User.findOne({email});
        if(userExists) {
            return res.status(400).json({error : "User already exists with this email"});
        }

        const mobileNoExists = await User.findOne({mobileNo});
        if(mobileNoExists) {
            return res.status(400).json({error : "Mobile number already registered"});
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save user
        const user = new User({
            name,
            mobileNo,
            email,
            password: hashedPassword
        });

        await user.save();
        res.status(201).json({message : 'User registered successfully. Please login to continue.'});
    } catch(error) {
        console.log(error);
        res.status(500).json({error : "Registration failed. Please try again."});
    }
}));


router.post('/login',(async(req,res)=>{
    const {email,password} = req.body;
    
    // fetch user data with email
    const userValidate = await User.findOne({email});
    if(!userValidate) return res.status(400).send({error : "User not found."});

    const validPassword = await bcrypt.compare(password,userValidate.password);
    if(!validPassword) return res.status(400).send({error : "Invalid Password."});

    const token = jwt.sign(
        {
            userId : userValidate._id,
            email : userValidate.email
        },process.env.JWT_SECRET_KEY,
        {
            expiresIn : '1d'
        }
    )
    res.json({message : "Login Successfully.",token});
    
}))

const auth = require('../middlewares/auth');

// Update username after signup
router.post('/username', auth, async(req, res) => {
    try {
        const userId = req.user.userId;
        const { username } = req.body;

        // Validate username
        if (!username || username.trim().length < 2) {
            return res.status(400).json({ error: "Username must be at least 2 characters" });
        }

        // Check if username already exists
        const existingUser = await User.findOne({ username: username.trim() });
        if (existingUser) {
            return res.status(400).json({ error: "Username already taken" });
        }

        // Update user with username
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { username: username.trim() },
            { new: true, runValidators: true }
        ).select('-password');

        return res.json({ message: "Username updated successfully", user: updatedUser });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

// Get user profile
router.get('/profile', auth, async(req, res) => {
    try {
        const userId = req.user.userId;

        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.json({ user });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;