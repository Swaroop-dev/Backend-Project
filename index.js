//new dev branch for development purpose
const express = require("express");
const { port, secretkey } = require("./Config/config");
const { connect } = require("./Config/database");
const User = require("./models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bodyparser=require("body-parser");

const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yml");

const app = express();
app.use(bodyparser.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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

connect();

app.listen(port, () => {
  console.log(`server running at port ${port}`);
});
