const User = require("../models/user")


exports.signup = async (req, res) => {
  try {
    console.log("second");
    console.log(req.body);
    const newUser = new User(req.body);
    console.log("after");
    await newUser.save();
    res.json({ message: "Signup Successful!" });
    console.log("after after");
  } catch (err) {
    res.status(400).json({ message: "Error during signup" });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.body.username,
      password: req.body.password,
    });

    if (!user) return res.status(400).json({ message: "Invalid Credentials" });

    res.json({ message: "Login Successful" });
  } catch (err) {
  console.log("Signup error:", err);       // ← REAL FIX
  res.status(400).json({ message: "Error during signup", error: err.message });
}
};
