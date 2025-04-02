const mysql = require("mysql2");
require("dotenv").config();

// Create MySQL connection
const db = mysql.createConnection({
    host: "localhost",
    user: process.env.DATABASE_USER || "root", // Fallback to "root"
    password: process.env.DATABASE_PASSWORD || "harshit14012006", // Fallback to an empty password
    database: "haryanalabbackend",
});

// Connect to MySQL database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL");
});

module.exports = db;
