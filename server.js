// const express = require("express");
// const app = express();
// const bodyParser = require("body-parser");

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// const users = [];

// app.get("/", (req, res) => {
//   res.send("Server is running!");
// });

// app.get("/users", (req, res) => {
//   res.json({ users });
// });

// app.post("/register", (req, res) => {
//   const { name, email, password, gender, age, height, weight } = req.body;

//   const existingUser = users.find((user) => user.email === email);
//   if (existingUser) {
//     return res
//       .status(400)
//       .json({ error: true, message: "Email already exists" });
//   }

//   if (password.length < 8) {
//     return res.status(400).json({
//       error: true,
//       message: "Password must be at least 8 characters long",
//     });
//   }

//   // Calculate BMR
//   const bmr = calculateBMR(gender, age, height, weight);

//   const newUser = {
//     name,
//     email,
//     password,
//     gender,
//     age,
//     height,
//     weight,
//     bmr, // Store BMR value
//   };

//   users.push(newUser);

//   res.json({ error: false, message: "User Created" });
// });

// app.post("/login", (req, res) => {
//   const { email, password } = req.body;

//   const user = users.find((user) => user.email === email);

//   if (!user) {
//     return res.status(400).json({ error: true, message: "User not found" });
//   }

//   if (user.password !== password) {
//     return res.status(400).json({ error: true, message: "Incorrect password" });
//   }

//   const loginResult = {
//     userId: `user-${Math.random().toString(36).substr(2, 9)}`,
//     name: user.name,
//     token: "your-auth-token",
//   };

//   res.json({ error: false, message: "success", loginResult });
// });

// function calculateBMR(gender, age, height, weight) {
//   let bmr = 0;

//   if (gender === "male") {
//     bmr = 10 * weight + 6.25 * height - 5 * age + 5;
//   } else if (gender === "female") {
//     bmr = 10 * weight + 6.25 * height - 5 * age - 161;
//   }

//   return bmr;
// }

// app.listen(3000, () => {
//   console.log("Server is running on port 3000");
// });
