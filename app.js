require('dotenv').config() ;
const express= require("express") ;
const bodyParser= require("body-parser") ;
const ejs= require("ejs") ;
const app= express() ;
const mongoose= require("mongoose") ;
const session = require('express-session') ;
const passport= require("passport") ;
const passportLocalMongoose= require("passport-local-mongoose") ; 


app.set('view engine', 'ejs') ;

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public")) ;


  app.use(session({
    secret: 'big secret',
    resave: false,
    saveUninitialized: false,
   // cookie: { secure: true }
  })) ;

  app.use(passport.initialize());
  app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true , useUnifiedTopology: true});
mongoose.set('useCreateIndex', true);

const userSchema= new mongoose.Schema({


    email: String,
    password: String
} );


userSchema.plugin(passportLocalMongoose);

const User= mongoose.model("user", userSchema) ;

passport.use(User.createStrategy());

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


    app.get("/", function(req,res){

        res.render("home") ;

    }) ;


    app.get("/login", function(req,res){

        res.render("login") ;

    }) ;

    app.get("/register", function(req,res){

        res.render("register") ;
       

    }) ;

    app.get("/secrets", function(req,res){

         // check if the user is already authenticated , as there might be the case that they directly wanna come to the secrets page 
         // after authenticating 
        

        if(req.isAuthenticated()) {   
        
        
            res.render("secrets") ;
        }
      

        else{
            res.redirect("/login") ;
        }
       
         
    }) ;

    app.post("/register",function(req,res){


        User.register({username: req.body.username}, req.body.password, function(err, user){

            if(err)
            {
                console.log(err) ;
                res.redirect("/register") ;
            }
     
            else{
                passport.authenticate("local") (req, res, function(){
                 res.redirect("/secrets") ;
                  
                }) ;
     
            }
     
            }) ;


    } ) ;


    app.post("/login", function(req,res){


        const user = new User({

        username: req.body.username,
        password: req.body.password

        }) ;


        req.login(user, function(err){

                if(err)console.log(err) ;
                else
                {
                    passport.authenticate("local") (req, res, function(){
                        res.redirect("/secrets") ;
                }) ;
              }
      
        }) ;
        

    }) ;


    app.get("/logout", function(req,res){

        req.logout() ;
        res.redirect("/") ;

    }) ;

    

    app.listen("3000",function() {
         console.log("The server is listening to port 3000") ;

    }) ;