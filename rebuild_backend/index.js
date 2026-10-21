const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./db');

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

app.use(express.json());

app.get('/', (req, res) => {
    res.send('LOST & FOUND IS RUNNING');
});

// global error handler
const util = require('util');

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