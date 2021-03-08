require('dotenv').config() ;
const express= require("express") ;
const bodyParser= require("body-parser") ;
const ejs= require("ejs") ;
const app= express() ;
const mongoose= require("mongoose") ;
const md5= require("md5") ;

app.set('view engine', 'ejs') ;

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public")) ;

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true , useUnifiedTopology: true});


const userSchema= new mongoose.Schema({


    email: String,
    password: String
} );




const User= mongoose.model("user", userSchema) ;


    app.get("/", function(req,res){

        res.render("home") ;

    }) ;


    app.get("/login", function(req,res){

        res.render("login") ;

    }) ;

    app.get("/register", function(req,res){

        res.render("register") ;

    }) ;


    app.post("/register",function(req,res){

        const newUser= new User({

            email: req.body.username ,
            password: md5(req.body.password)
        } ) ;

        newUser.save( function (err) { 


            if(err)console.log(err) ;

            else{
                res.render("secrets") ;
            }

         }) ;

    } ) ;


    app.post("/login", function(req,res){

        const uname= req.body.username ;
        const pass= md5(req.body.password) ;

        var query = {$and:[{email:{$regex: uname, $options: 'i'}},{password:{$regex: pass, $options: 'i'}}]} ;

        User.find(query , function (err, data) {
            if(err) {
              console.log(err) ;
            }
            else{
                res.render("secrets") ;
            }

         });

    }) ;

    app.listen("3000",function() {
         console.log("The server is listening to port 3000") ;

    }) ;