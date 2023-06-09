const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Menggunakan body-parser untuk mengakses request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Data pengguna yang terdaftar
const users = [];

// Endpoint untuk memeriksa status server
app.get('/', (req, res) => {
  res.send('Server is running!');
});


// Register endpoint
app.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  // Periksa apakah email sudah digunakan sebelumnya
  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    return res.status(400).json({ error: true, message: 'Email already exists' });
  }

  // Periksa panjang password
  if (password.length < 8) {
    return res.status(400).json({ error: true, message: 'Password must be at least 8 characters long' });
  }

  // Buat objek pengguna baru
  const newUser = {
    name,
    email,
    password
  };

  // Tambahkan pengguna ke daftar pengguna terdaftar
  users.push(newUser);

  res.json({ error: false, message: 'User Created' });
});

// Login endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Periksa apakah pengguna dengan email tersebut ada
  const user = users.find((user) => user.email === email);

  if (!user) {
    return res.status(400).json({ error: true, message: 'User not found' });
  }

  // Periksa apakah password cocok
  if (user.password !== password) {
    return res.status(400).json({ error: true, message: 'Incorrect password' });
  }

  // Jika berhasil login, kirim respons dengan informasi pengguna dan token
  const loginResult = {
    userId: `user-${Math.random().toString(36).substr(2, 9)}`,
    name: user.name,
    token: 'your-auth-token'
  };

  res.json({ error: false, message: 'success', loginResult });
});

// Menjalankan server di port 3000
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
