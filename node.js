/**
 * PANDA PLANET BOOKS - RENDER BACKEND
 * * TO DEPLOY ON RENDER:
 * 1. Create a folder on your computer.
 * 2. Save this code as 'server.js'.
 * 3. Create a file named 'package.json' in the same folder with this content:
 * {
 * "name": "panda-backend",
 * "version": "1.0.0",
 * "main": "server.js",
 * "dependencies": {
 * "express": "^4.18.2",
 * "cors": "^2.8.5",
 * "body-parser": "^1.20.2"
 * },
 * "scripts": {
 * "start": "node server.js"
 * }
 * }
 * 4. Upload both files to a GitHub repository.
 * 5. Connect the repo to a new "Web Service" on Render.com.
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Enable CORS so your frontend can talk to this server
app.use(cors());
app.use(bodyParser.json());

// IN-MEMORY DATABASE 
// (Note: Data resets if Render service sleeps. Use MongoDB for permanent storage.)
let orders = [];
let users = [];

// --- API ROUTES ---

// 1. Root check (To see if server is alive)
app.get('/', (req, res) => {
    res.send("Panda Planet API is live and running.");
});

// 2. Create User (Registration)
app.post('/register', (req, res) => {
    const { email, password, name } = req.body;
    
    if (!email || !password) {
        return res.status(400).send({ message: "Email and password required" });
    }

    if (users.find(u => u.email === email)) {
        return res.status(400).send({ message: "User already exists" });
    }

    const newUser = { email, password, name, role: 'user' };
    users.push(newUser);
    console.log(`New user registered: ${email}`);
    res.status(201).send({ message: "User created", user: { name, email } });
});

// 3. Login
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Return user details without the password for security
        const { password, ...safeUser } = user;
        res.send({ user: safeUser });
    } else {
        res.status(401).send({ message: "Invalid email or password" });
    }
});

// 4. Create Order
app.post('/orders', (req, res) => {
    const { user, items, total } = req.body;
    
    const order = {
        id: Date.now(),
        user: user || "Anonymous",
        items: items || "No items",
        total: total || 0,
        date: new Date()
    };
    
    orders.push(order);
    console.log(`New order received from: ${user}`);
    res.status(201).send(order);
});

// 5. Get Orders (Admin Only)
app.get('/orders', (req, res) => {
    res.send(orders);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Panda Planet Backend running on port ${PORT}`);
});