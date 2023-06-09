const { usersCollection } = require("../database");
const { calculateBMR } = require("../utils");

async function getUsers(req, res) {
  try {
    const users = await usersCollection.find().toArray();
    res.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: true, message: "Failed to fetch users" });
  }
}

async function registerUser(req, res) {
  const { name, email, password, gender, age, height, weight } = req.body;

  try {
    const existingUser = await usersCollection.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: true, message: "Email already exists" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({
          error: true,
          message: "Password must be at least 8 characters long",
        });
    }

    const bmr = calculateBMR(gender, age, height, weight);

    const newUser = {
      name,
      email,
      password,
      gender,
      age,
      height,
      weight,
      bmr,
    };

    await usersCollection.insertOne(newUser);

    res.json({ error: false, message: "User Created" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: true, message: "Failed to create user" });
  }
}

async function loginUser(req, res) {
  const { email, password } = req.body;

  try {
    const user = await usersCollection.findOne({ email });

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
    console.error("Error logging in:", error);
    res.status(500).json({ error: true, message: "Failed to login" });
  }
}

module.exports = {
  getUsers,
  registerUser,
  loginUser,
};
