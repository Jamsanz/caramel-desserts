const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const ejs = require('ejs');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const findOrCreate = require('mongoose-findorcreate');

const app=express();
app.set('view engine', 'ejs');
app.use(express.static("Public"));

app.use(bodyParser.urlencoded({extended:true}));
app.use(session({
    secret:"Our little secret.",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect( "mongodb+srv://admin-deeni:muha234mmad@cluster0.n2lhm.mongodb.net/caramelDB",{useUnifiedTopology:true, useNewUrlParser:true});
mongoose.set("useCreateIndex", true);

const currentdate = new Date();
const datetime = currentdate.getDay() + "/" + currentdate.getMonth() 
+ "/" + currentdate.getFullYear() + " @ " 
+ currentdate.getHours() + ":" 
+ currentdate.getMinutes() + ":" + currentdate.getSeconds();

const orderSchema= new mongoose.Schema({
    name: String,
    phone: String,
    email: String,
    message: String,
    date: String,
    service:String,
    received: String
}); 
const userSchema= new mongoose.Schema({
    email:String,
    password:String
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = mongoose.model('User',userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

const Order = mongoose.model('Order',orderSchema);

passport.use(User.createStrategy());

app.get("/", (req, res)=>{
    res.render('index');
});

app.get("/admin",(req,res)=>{
    res.render('login');
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
        service,
        received:datetime
    });
    orderz.save(()=>{
        res.send(`<script>alert('Thank you for patronizing us'); window.location='https://quiet-brushlands-18261.herokuapp.com';</script>`);
    });
});

app.post('/login',(req, res)=>{
    const user = new User({
        username:req.body.username,
        password:req.body.password
      });

  req.login(user,(err)=>{
        if (err) {
            console.log(err);
        } else {
            passport.authenticate('local')(req,res,()=>{
                res.redirect("/dashboard");
            })
        }
    });
    
});

app.get("/register",(req, res)=>{
    res.render('register');
});

app.get('/dashboard', (req, res)=>{
    if (req.isAuthenticated()) {
        Order.find((err, result)=>{
        if (err) {
            console.log(err)
        } else {
            res.render("dashboard",{
                results: result
            });
        }
    });
    } else {
        res.redirect('/admin');
    }
    
});

app.post('/register', (req, res)=>{
    User.register({username:req.body.username},req.body.password,(err, user)=>{
        if (err) {
            console.log(err)
        } else {
            passport.authenticate("local")(req, res, ()=>{
                res.redirect("/dashboard");
            });
        }
    });
});

app.listen(process.env.PORT || 3000, ()=>{
    console.log("server running on port 3000");
});