const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./models/userSchema");

const SECRET_KEY = "secretkey";

// connect to express app
const app = express();

//connect to mongo db
const dbURI =
  "mongodb+srv://pramitsrivastava476:Pramit123@cluster10.1vn5baw.mongodb.net/UserDB?retryWrites=true&w=majority";
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(9000, () => {
      console.log("Server is connected to port 9000 and connected to mongo db");
    });
  })
  .catch((error) => {
    console.log("Unable to connect to server and or mongodb");
  });
//middleware
app.use(bodyParser.json());
app.use(cors());
//schema

//routes
//User Registration
//POST REGISTER
app.post("/register", async (req, res) => {
  //we are using express app to post data into the path /register
  try {
    const { email, username, password } = req.body; // we are going to enter those values which we want the user to input here body is ui
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, username, password: hashedPassword }); // creating a new schema
    await newUser.save(); // saving it
    res.status(201).json({ message: "User Created Successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message});
  }
});

//GET REGISTERED USERS
app.get("/register", async (req, res) => {
  try {
    const users = await User.find();
    res.status(201).json(users);
  } catch (error) {
    res.status(500).json({ error: "Unable to get users" });
  }
});

//GET LOGIN
//POST REQUEST
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username }); //we will find in the schema the username if he/she exist
    if (!user) {
      return res.status(401).json({ error: "Invalid Credentials" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password); //we are using bcrypt to compare the password saved in db and the password entered by the user  during login
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid Credentials" });
    }
    const token = jwt.sign({ userId: user._id }, SECRET_KEY, {
      expiresIn: "1hr",
    });
    res.json({ message: "LOGIN SUCCESSFUL" });
  } catch (error) {
    res.status(500).json({ error: "Error logging in" });
  }
});

// CREATE = POST REQUEST
// READ = GET REQUEST
// UPDATE = PUT OR PATCH REQUEST
// DELETE = DELETE REQUEST
