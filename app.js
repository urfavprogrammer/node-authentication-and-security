//jshint esversion:6
import 'dotenv/config'
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import encrypt from "mongoose-encryption";

const app = express();
const port = 3000;
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://127.0.0.1:27017/userDB", {useNewUrlParser:true});

const userSchema = new mongoose.Schema({
    email : String,
    password: String
});

// Database Encryption

userSchema.plugin(encrypt, { secret: process.env.SECRET_KEY, encryptedFields: ["password"] });

const User = new mongoose.model("User", userSchema);


app.get("/", (req, res) =>{
    res.render("home")
});
app.get("/logout", (req, res) =>{
    res.render("home")
});
app.get("/login", (req, res) =>{
    res.render("login")
});
app.get("/register", (req, res) =>{
    res.render("register")
});

app.post("/register", (req, res)=>{
    const newUser = new User({
        email: req.body.username,
        password:req.body.password
    });

    newUser.save().then(()=>{
        res.render("secrets");
    }).catch((err)=>{
        console.log(err)
    });
});

app.post("/login",  (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username })
        .then((foundUser) => {
            if (foundUser) {
                if (foundUser.password === password) {
                    res.render("secrets");
                }
            }
        })
        .catch((err) => {
            //When there are errors We handle them here

            console.log(err);
            res.send(400, "Bad Request");
        });
    });





app.listen(port, ()=>{
    console.log(`Server running at port ${port}`)
})

