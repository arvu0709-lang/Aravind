const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory user data (simulating database)
let users = [
  { id: 1, name: "Alice", role: "Admin", status: "Active", avatar: "A" },
  { id: 2, name: "Bob", role: "User", status: "Active", avatar: "B" },
  { id: 3, name: "Charlie", role: "User", status: "Inactive", avatar: "C" },
  { id: 4, name: "Diana", role: "Manager", status: "Active", avatar: "D" },
  { id: 5, name: "Eve", role: "Admin", status: "Active", avatar: "E" },
  { id: 6, name: "Frank", role: "User", status: "Pending", avatar: "F" },
];

// Counter variable
let counter = 0;

// API Routes

// Get all users
app.get('/api/users', (req, res) => {
  const { search } = req.query;
  
  if (search) {
    const filteredUsers = users.filter(
      user =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.role.toLowerCase().includes(search.toLowerCase())
    );
    return res.json(filteredUsers);
  }
  
  res.json(users);
});

// Get single user by ID
app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user);
});

// Create new user
app.post('/api/users', (req, res) => {
  const { name, role, status } = req.body;
  
  if (!name || !role) {
    return res.status(400).json({ message: "Name and role are required" });
  }
  
  const newUser = {
    id: users.length + 1,
    name,
    role,
    status: status || "Active",
    avatar: name.charAt(0).toUpperCase()
  };
  
  users.push(newUser);
  res.status(201).json(newUser);
});

// Update user
app.put('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  
  const { name, role, status } = req.body;
  if (name) user.name = name;
  if (role) user.role = role;
  if (status) user.status = status;
  if (name) user.avatar = name.charAt(0).toUpperCase();
  
  res.json(user);
});

// Delete user
app.delete('/api/users/:id', (req, res) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: "User not found" });
  }
  
  const deletedUser = users.splice(index, 1)[0];
  res.json({ message: "User deleted", user: deletedUser });
});

// Counter routes
app.get('/api/counter', (req, res) => {
  res.json({ counter });
});

app.post('/api/counter/increment', (req, res) => {
  counter++;
  res.json({ counter });
});

app.post('/api/counter/reset', (req, res) => {
  counter = 0;
  res.json({ counter });
});

// Dashboard stats
app.get('/api/stats', (req, res) => {
  const activeUsers = users.filter(u => u.status === "Active").length;
  res.json({
    totalUsers: users.length,
    activeUsers,
    counter
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

