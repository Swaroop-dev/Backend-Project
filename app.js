const express=require('express');
const app=express()

const User = require("./models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yml");
const {secretkey}=require("./Config/config");
const cookieParser=require("cookie-parser");
const fileUpload = require("express-fileupload");

//middlewares to be used 

app.use(cookieParser());
app.use(fileUpload());

app.use(express.json());
app.use(express.urlencoded({extend:true}));



app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//dummy routes
app.post("/register", async (req, res) => {
  try {
    // console.log(req.body)
    const { name, email, password } = req.body;
    console.log("hello  world")
    
    if (!name && !email && !password) {
      res.status(400).send("All fields are required");
    }
    const user = await User.findOne({email });
    console.log(user)
    if (user) {
      return res.send("user already exist");
    }
    const encrypted_password = await bcrypt.hash(password, 10);
    // console.log(encrypted_password)
    const newUser = await User.create({
      name: name,
      email: email,
      password: encrypted_password,
    });
    // console.log(newUser)
    newUser.password = undefined;
    const token = jwt.sign({ id: newUser._id }, secretkey, {
      expiresIn: "5d",
    });

    res.status(201).json({ newUser, token });
  } catch (err) {
    res.status(400).send("something went wrong while storing user");
  }
});



//importing routes from routes.js
const userRoutes=require('./routes/userRoutes')



//exposing routes 
app.use('/api/v1',userRoutes)

module.exports=app;