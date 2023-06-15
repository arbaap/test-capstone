const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose
  .connect(
    "mongodb+srv://test-capstone:testcapstone@cluster0.93sie2d.mongodb.net/testcapstone",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  gender: String,
  age: Number,
  height: Number,
  weight: Number,
  bmr: Number,
  calories: Number,
});

const User = mongoose.model("User", userSchema);

const jwtSecret = crypto.randomBytes(32).toString("hex");

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: true, message: "Server error" });
  }
});

app.post("/register", async (req, res) => {
  const { name, email, password, gender, age, height, weight } = req.body;

  try {
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: true, message: "Email already exists" });
    }

    if (password.length < 8) {
      return res.status(400).json({
        error: true,
        message: "Password must be at least 8 characters long",
      });
    }

    const bmr = calculateBMR(gender, age, height, weight);

    const newUser = new User({
      name,
      email,
      password,
      gender,
      age,
      height,
      weight,
      bmr,
    });

    await newUser.save();

    res.json({ error: false, message: "User Created" });
  } catch (error) {
    res.status(500).json({ error: true, message: "Server error" });
  }
});

function calculateBMR(gender, age, height, weight) {
  let bmr = 0;
  if (gender === "male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else if (gender === "female") {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }
  return bmr;
}

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(400).json({ error: true, message: "User not found" });
    }

    if (user.password !== password) {
      return res
        .status(400)
        .json({ error: true, message: "Incorrect password" });
    }

    const loginResult = {
      userId: user._id,
      name: user.name,
      email: user.email,
      password: user.password,
      gender: user.gender,
      age: user.age,
      height: user.height,
      weight: user.weight,
      bmr: user.bmr,
      calories: user.calories,
      token: jwt.sign({ userId: user._id }, jwtSecret),
    };

    res.json({ error: false, message: "success", loginResult });
  } catch (error) {
    res.status(500).json({ error: true, message: "Server error" });
  }
});

app.post("/update-bmr", async (req, res) => {
  const { userId, bmr, calories } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ error: true, message: "User not found" });
    }

    user.bmr = bmr;
    user.calories = calories;
    await user.save();

    res.json({
      error: false,
      message: "BMR and calories updated successfully",
    });
  } catch (error) {
    res.status(500).json({ error: true, message: "Server error" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
