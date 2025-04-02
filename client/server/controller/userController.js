const db = require("../database/db");

// GET all ledger entries
exports.getAllUsers = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM ledger";
    db.query(sqlQuery, (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).send("Database query error");
      }
      res.json(results);
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).send("Server error");
  }
};

// POST a new ledger entry (Credit)
exports.addUserByCredit = async (req, res) => {
  try {
    const { Date, Reportno, PartyName, Credit, Debit, Remarks } = req.body;
    if (!Date || !PartyName || !Credit) {
      return res.status(400).json({ error: "Date, PartyName, and Credit are required" });
    }

    const sqlQuery = `
      INSERT INTO ledger (Date, Reportno, PartyName, Credit, Debit, Remarks)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(
      sqlQuery,
      [Date, Reportno, PartyName, Credit, Debit, Remarks],
      (err, result) => {
        if (err) {
          console.error("Error adding user:", err);
          return res.status(500).json({ error: "Database insert error" });
        }
        const newEntry = {
          id: result.insertId,
          Date,
          Reportno,
          PartyName,
          Credit,
          Debit,
          Remarks,
        };
        res.status(201).json(newEntry);
      }
    );
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).send("Server error");
  }
};

// POST a new ledger entry (Debit)
exports.addUserByDebit = async (req, res) => {
  console.log(req.body);
  try {
    const { Date, PartyName, Reportno, Debit, Remarks } = req.body;
    if (!Date || !PartyName || !Debit) { // Reportno can be "null", so not strictly required
      return res.status(400).json({ error: "Date, PartyName, and Debit are required" });
    }

    const sqlQuery =
      "INSERT INTO ledger (Date, PartyName, Reportno, Debit, Remarks) VALUES (?,?,?,?,?)";
    db.query(
      sqlQuery,
      [Date, PartyName, Reportno || "null", Debit, Remarks || ""],
      (err, result) => {
        if (err) {
          console.error("Error inserting user:", err);
          return res.status(500).send("Database insert error");
        }

        const newEntry = {
          id: result.insertId,
          Date,
          PartyName,
          Reportno: Reportno || "null",
          Debit,
          Remarks: Remarks || "",
          Credit: null,
        };
        res.status(201).json(newEntry); // Return full entry with id
      }
    );
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).send("Server error");
  }
};
// DELETE a ledger entry (general deletion)
exports.deleteUser = async (req, res) => {
  try {
    let sqlQuery;
    console.log(req.params, " At line 55");
    const { Reportno, Date, PartyName } = req.params;
    if (!Date || !PartyName) {
      return res.status(400).json({ error: "Report number is required" });
    }
    if (!Reportno) {
      sqlQuery = "DELETE FROM ledger WHERE Reportno = ? AND Date = ?";
      db.query(sqlQuery, [Reportno, Date], (err, result) => {
        if (err) {
          console.error("Error deleting user:", err);
          return res.status(500).json({ error: "Database delete error" });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "User deleted successfully" });
      });
    } else {
      sqlQuery = "DELETE FROM ledger WHERE PartyName = ? AND Date = ?";
      db.query(sqlQuery, [PartyName, Date], (err, result) => {
        if (err) {
          console.error("Error deleting user:", err);
          return res.status(500).json({ error: "Database delete error" });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "User deleted successfully" });
      });
    }
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).send("Server error");
  }
};

// UPDATE a ledger entry
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Name and Email are required" });
    }

    const sqlQuery = "UPDATE ledger SET name = ?, email = ? WHERE id = ?";

    db.query(sqlQuery, [name, email, id], (err, result) => {
      if (err) {
        console.error("Error updating user:", err);
        return res.status(500).send("Database update error");
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ message: "User updated successfully" });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).send("Server error");
  }
};

// GET ledger entries by PartyName
exports.getUsersByName = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM ledger WHERE PartyName = ?";
    db.query(sqlQuery, req.params.name, (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).send("Database query error");
      }
      results.length > 0
        ? res.json(results)
        : res.send({ message: "Not Found" });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).send("Server error");
  }
};

// GET ledger entries by date range
exports.getUsersByDate = async (req, res) => {
  const { fromDate, toDate } = req.params;
  console.log(fromDate, toDate);
  try {
    const sqlQuery = "SELECT * FROM ledger WHERE Date BETWEEN ? AND ?";
    db.query(sqlQuery, [fromDate, toDate], (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).send("Database query error");
      }
      results.length > 0
        ? res.json(results)
        : res.send({ message: "Not Found" });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).send("Server error");
  }
};

// DELETE a ledger entry by id (for Credit entries)
exports.deleteUserByCredit = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(req.params, " At line 55");

    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }

    const sqlQuery = "DELETE FROM ledger WHERE id = ?";
    db.query(sqlQuery, [id], (err, result) => {
      if (err) {
        console.error("Error deleting user:", err);
        return res.status(500).json({ error: "Database delete error" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Entry not found" });
      }
      return res.status(200).json({ message: "Entry deleted successfully" });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).send("Server error");
  }
};

// DELETE a ledger entry by id (for Debit entries)
exports.deleteUserByDebit = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(req.params, " At line 55");

    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }

    const sqlQuery = "DELETE FROM ledger WHERE id = ?";
    db.query(sqlQuery, [id], (err, result) => {
      if (err) {
        console.error("Error deleting user:", err);
        return res.status(500).json({ error: "Database delete error" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Entry not found" });
      }
      return res.status(200).json({ message: "Entry deleted successfully" });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).send("Server error");
  }
};

// GET ledger entries by city
exports.getByCity = async (req, res) => {
  const { state, district, city } = req.body;
  console.log(state, district, city);
  if (!state || !district || !city) {
    return res
      .status(400)
      .json({ message: "State, district, and city are required" });
  }

  try {
    const query = `
      SELECT ledger.*
      FROM ledger 
      INNER JOIN customer ON ledger.PartyNAME = customer.PartyNAME
      WHERE customer.state = ? AND customer.district = ? AND customer.city = ?
    `;

    db.query(query, [state, district, city], (err, results) => {
      if (err) console.log(err);
      else
        res.json({
          status: 200,
          data: results,
        });
    });
  } catch (error) {
    console.error("Error fetching ledger data:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while fetching ledger data" });
  }
};

// GET customers by location
exports.getCustomerByLocation = async (req, res) => {
  const { state, district, city } = req.body;
  console.log(state, district, city);

  if (!state || !district || !city) {
    return res.status(400).json({
      message: "State, district, and city are required",
    });
  }

  try {
    const query = `
      SELECT * FROM customer 
      WHERE state = ? AND district = ? AND city = ?
    `;

    db.query(query, [state, district, city], (err, results) => {
      if (err) {
        console.error("Error fetching customer data:", err);
        return res.status(500).json({
          message: "An error occurred while fetching customer data",
        });
      }

      res.json({
        status: 200,
        data: results,
      });
    });
  } catch (error) {
    console.error("Error in API:", error);
    return res.status(500).json({
      message: "An unexpected error occurred",
    });
  }
};