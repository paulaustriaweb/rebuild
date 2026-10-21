const { Pool } = require("pg");
require("dotenv").config();

const connectionString = process.env.DATABASE_URL.replace("?sslmode=require", "");

const pool = new Pool({
    connectionString,
    ssl: {
        rejectUnauthorized: false, // force trust
    },
});

module.exports = pool;

pool.query("SELECT NOW()", (err, res) => {
    if (err) {
        console.error("Database connection failed:", err.message);
    }else{
        console.log("Database connected:", res.rows[0]);
    }
});