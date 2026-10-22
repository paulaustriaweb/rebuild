const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.set('trust proxy', 1);

const helmet = require("helmet");
app.use(helmet());

// CORS: allow only your Vercel + localhost domains
app.use(cors({
    origin: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",")
    : ["http://localhost:3000"], // fallback for local dev
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
}))

// Health route for render
app.get("/health", (_req, res) => res.status(200).json({ ok: true }));

const pool = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// global error handler
const util = require('util');

app.use(express.json());

app.get('/', (req, res) => {
    res.send('LOST & FOUND IS RUNNING');
});

// for registration
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // 1. validation
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'All fields are required.'});
        }
        if (password.length < 9 ) {
            return res.status(400).json({ error: 'Password must be at least 9 characters'});
        }

        // 2. Check if user already exist
        const userCheck = await pool.query(
            'SELECT 1 FROM users WHERE username = $1 OR email = $2',
            [username, email]
        );

        if (userCheck.rows.length > 0) {
            return res.status(400).json({ error: 'Username or email already taken' }); 
        }
        
        // 3. Hash password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // 4. Insert into DB
        const result = await pool.query(
            `INSERT INTO users (username, email, password_hash)
            VALUES ($1, $2, $3)
            RETURNING user_id, username, email, role, date_joined`,
            [username, email, password_hash]
        );

        // 5. success
        return res.status(201).json({
            message: 'User is registered successfully!',
            user: result.rows[0]
        });

    } catch (err) {
        console.error("Register error:", err.message);
        return res.status(500).json({ error: 'Something went wrong on the server.' });
    }
})

// ================= login =================
app.post("/api/login", async (req, res) => {
    try {
        const { usernameOrEmail, password } = req.body;

        if (!usernameOrEmail || !password ) {
            return res.status(400).json({ error: "All fields are required."});
        }

        const userResult = await pool.query(
            "SELECT * FROM users WHERE username = $1 OR email = $1",
            [usernameOrEmail]
        );
        if (userResult.rows.length === 0) {
            return res.status(400).json({ error: "Invalid credentials."});
        }

        const user = userResult.rows[0];

        const passwordMatch = await bcrypt.compare(password, user.password_hash);
        if (!passwordMatch) {
            return res.status(401).json({ error: "Invalid credentials."});
        }

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is missing in .env");
        }

        const token = jwt.sign(
            {
                user_id: user.user_id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );
        
        return res.json({
            message: "Login successful!",
            token,
            user: {
                user_id: user.user_id,
                username: user.username,
                email: user.email,
                role: user.role,
                date_joined: user.date_joined,
            },
        });
    } catch (err) {
        console.error("Login error:", err.message);
        return res.status(500).json({ error: "Internal server error" });
    }
});

function authenticateToken(req, res, next ) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split('')[1];
    if (!token) {
        return res.status(401).json({ error: 'No token provided.'});
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
});
}


// global error part 2
//=============GLOBAL ERROR HANDLER =============
app.use((err, req, res, next) => {
    console.error('GLOBAL ERROR:', util.inspect(err,  {showHidden: false, depth: null }));
    if (err && err.stack) {
        console.error('STACK:', err.stack);
    }
    return res.status(500).json({ error: 'Something went wrong' });
})

module.exports = app;
if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
}