const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const app=express();

app.use(express.static("Public"));

app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect('mongodb://localhost:27017/caramelDB',{useUnifiedTopology:true, useNewUrlParser:true});

const orderSchema= new mongoose.Schema({
    name: String,
    phone: String,
    email: String,
    message: String,
    date: String,
    service:String
}); 

const Order = mongoose.model('Order',orderSchema);

app.get("/", (req, res)=>{
    res.sendFile(__dirname+"/index.html");
});

app.post("/",(req, res)=>{

    let service='';

    if (req.body.cake=='on') {
        service='cake'
    } else {
        service='desserts'
    }

    const orderz = new Order({
        name: req.body.name,
        phone:req.body.phone,
        email:req.body.email,
        message:req.body.message,
        date:req.body.datee,
        service
    });
    orderz.save(()=>{
        res.send(`<script>alert('Thank you for patronizing us'); window.location='http://localhost:3000';</script>`);
    });
});

app.listen(3000, ()=>{
    console.log("server running on port 3000");
});