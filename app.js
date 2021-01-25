const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const app=express();

app.use(express.static("Public"));

app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect( "mongodb+srv://admin-deeni:muha234mmad@cluster0.n2lhm.mongodb.net/caramelDB",{useUnifiedTopology:true, useNewUrlParser:true});

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
        res.send(`<script>alert('Thank you for patronizing us'); window.location='https://quiet-brushlands-18261.herokuapp.com';</script>`);
    });
});

app.listen(process.env.PORT || 3000, ()=>{
    console.log("server running on port 3000");
});