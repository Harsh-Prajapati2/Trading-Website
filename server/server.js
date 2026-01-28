const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use(cors()); // it is middleware 
app.use(express.json());


mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("Connected to MongoDB");
})
.catch((err)=>{
    console.log("Error connecting to MongoDB" + err );
})

app.get("/",(req,res)=>{
    res.send({message:"Backend is running"});
});
app.use('/auth',require("./routes/auth.routes"));
app.use('/kyc',require("./routes/kyc.routes"));
app.use('/wallet',require("./routes/wallet.routes"))


app.listen(5000,()=>{
    console.log("Server is running on port 5000");
});