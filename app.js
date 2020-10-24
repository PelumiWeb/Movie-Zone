const express = require("express");
const app = express();
const User = require("./src/models/users");
require("./src/db/mongoose");
const cookieParser = require("cookie-parser");
const { requireAuth, checkUser } = require("./middleware/authmiddleware");
require('dotenv').config()
const {transporter,
  mailOptions} = require('./email')

const port = process.env.PORT 
console.log(port)

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 5000;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});
app.get("/twitter", (req, res) => {
  res.redirect("https://twitter.com");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/", (req, res) => {
  res.render("home");
});
app.get("/index", (req, res) => {
  res.render("index", {
    name: "Pelumi",
  });
});

app.get("/login", (req, res) => {
  console.log(req.body.email);
  res.render("login");
});

const bcrypt = require("bcrypt");
app.post("/register", async (req, res) => {
  const maxage = 3 * 24 * 60 * 60;
  try {
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      name: req.body.username,
      email: req.body.email,
      password: hashPassword,
    });
    const token = await user.generateToken();

    await user.save();
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxage * 1000 });
    res.render("index", {
      name: user.name,
    });
    console.log(user);
  } catch (e) {
    console.log(e);
    res.render("error");
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const maxage = 3 * 24 * 60 * 60;
  console.log(email);

  try {
    const user = await User.login(email, password);
    const token = await user.generateToken();
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxage * 1000 });
    res.render("index", {
      name: email,
    });
  } catch (e) {
    res.status(400).render("error");
  }
});

// app.get("*", checkUser, (req, res) => {});

app.get("/profile", requireAuth, (req, res) => {
  res.render("profile");
});

app.get("/logout", (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.render("login");
});

app.listen(port, () => {
  console.log(`app is running at port ${port}`);
});
const message = 'Pelumi sent you this.'

// Step 3
transporter.sendMail(mailOptions, (err, data) => {
  if (err) {
      console.log('There is an error')
  } else {
      console.log('Email sent!!!')
  }
  });