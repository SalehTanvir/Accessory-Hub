const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.registerUser = async (req, res) => {
  try {

    const { name, email, password } = req.body;

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      message: "User registered successfully",
      user
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};