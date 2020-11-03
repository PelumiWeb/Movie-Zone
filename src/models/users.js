const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { isEmail } = require("validator");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    lowercase: true,
    trim: true,
    validate: [(val) => {}, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [6, "minimum password is 6 characters"],
  },
});

const maxage = 3 * 24 * 60 * 60;
userSchema.methods.generateToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.TOKEN, {
    expiresIn: maxage,
  });
console.log(token)
  return token;
};

userSchema.statics.login = async function (email, password) {
  const users = this;
  const user = await users.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("Incorrect Password");
  }
  throw Error("Incorrect email");
};

const User = mongoose.model("User", userSchema);

module.exports = User;
