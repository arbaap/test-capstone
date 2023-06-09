const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Menghubungkan ke database MongoDB
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

// Definisikan schema dan model Mongoose
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  gender: String,
  age: Number,
  height: Number,
  weight: Number,
});

const User = mongoose.model("User", userSchema);

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

    const newUser = new User({
      name,
      email,
      password,
      gender,
      age,
      height,
      weight,
    });

    await newUser.save();

    res.json({ error: false, message: "User Created" });
  } catch (error) {
    res.status(500).json({ error: true, message: "Server error" });
  }
});

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
      userId: `user-${Math.random().toString(36).substr(2, 9)}`,
      name: user.name,
      token: "your-auth-token",
    };

    res.json({ error: false, message: "success", loginResult });
  } catch (error) {
    res.status(500).json({ error: true, message: "Server error" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
