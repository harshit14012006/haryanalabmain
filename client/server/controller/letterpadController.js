const db = require("../database/db");

// GET all letterpads
// const getAllLetterpads = (req, res) => {
//   const query = "SELECT * FROM letterpads ORDER BY created_at DESC";

//   db.query(query, (err, results) => {
//     if (err) {
//       console.error("Error fetching letterpads:", err);
//       return res.status(500).json({ error: "Database error" });
//     }
//     res.status(200).json(results);
//   });
// };

// POST a new letterpad
exports.createLetterpad = (req, res) => {
    const { signature, content } = req.body;
  
    if (!signature || !content) {
      return res.status(400).json({ message: "Signature and content are required." });
    }
  
    const query = "INSERT INTO letterpads (signature, content) VALUES (?, ?)";
    db.query(query, [signature, content], (err, result) => {
      if (err) {
        console.error("Error inserting letterpad:", err);
        return res.status(500).json({ message: "Internal server error." });
      }
  
      res.status(201).json({ message: "Letterpad saved successfully!" });
    });
  };
  

// module.exports = {
//   getAllLetterpads,
// };
