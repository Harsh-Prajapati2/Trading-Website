const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(cors()); // it is middleware 
app.use(express.json());


mongoose.connect("mongodb://127.0.0.1:27017/Exotic1")
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
app.use('/auth',require("./routes/kyc.routes"));
app.use('/wallet',require("./routes/wallet.routes"))


app.listen(5000,()=>{
    console.log("Server is running on port 5000");
});