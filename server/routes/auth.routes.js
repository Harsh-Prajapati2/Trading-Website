const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

router.post("/register",(async(req,res)=>{
    const {name,mobileNo,email,password} = req.body;
    const hashedPassword = await bcrypt.hash(password,10);
    const user = User({name,mobileNo,email,password : hashedPassword});

    const userExists = await User.findOne({email});
    const mobileNoExists = await User.findOne({mobileNo});
    // user email id exist then res 'User already Exist
    if(userExists) return res.status(200).send({error : "User alreaddy Exists."});
    if(mobileNoExists) return res.status(200).send({error : "Mobile Number already Exists."});
    else {
        await user.save();
        res.send ({message : 'User registered successfully.'});
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

module.exports = router;