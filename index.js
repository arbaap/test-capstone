const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const port = 3000;

// Simulated user data storage
const users = [];

// Middleware to parse request body
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Server is running!");
});

// ...

// GET endpoint to get the list of registered users
app.get("/users", (req, res) => {
  res.json(users);
});

// ...

// Register endpoint
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  // Check if email already exists
  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    return res
      .status(400)
      .json({ error: true, message: "Email already exists" });
  }

  // Hash the password
  const saltRounds = 10;
  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      return res
        .status(500)
        .json({ error: true, message: "Failed to create user" });
    }

    // Create new user object
    const newUser = {
      id: users.length + 1,
      name,
      email,
      password: hash,
    };

    // Store the user
    users.push(newUser);

    return res.json({ error: false, message: "User Created" });
  });
});

// Login endpoint
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = users.find((user) => user.email === email);
  if (!user) {
    return res
      .status(401)
      .json({ error: true, message: "Invalid email or password" });
  }

  // Compare password
  bcrypt.compare(password, user.password, (err, result) => {
    if (err || !result) {
      return res
        .status(401)
        .json({ error: true, message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, "your_secret_key");

    return res.json({
      error: false,
      message: "Success",
      loginResult: {
        userId: user.id,
        name: user.name,
        token,
      },
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
