const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { connectToDatabase } = require("./database");
const { registerUser, loginUser, getUsers } = require("./routes/users");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

connectToDatabase();

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.get("/users", getUsers);
app.post("/register", registerUser);
app.post("/login", loginUser);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
