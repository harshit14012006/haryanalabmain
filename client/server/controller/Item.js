const db = require("../database/db");

const setItem = (req, res) => {
  try {
    const query = `INSERT INTO item(ItemName,Date) VALUES ( ?, ?)`;

    const values = [req.body.name, req.body.date];
    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Error inserting data:", err);
        return res.status(500).json({ message: "Error inserting data" });
      }
      res.status(200).json({
        message: "Analysis record created successfully",
        id: result.insertId,
      });
    });
  } catch (err) {
    if (err) {
      console.error("Error setting item:", err);
      return res.status(500).json({ message: "Error setting item" });
    }
  }
};

const getItem = (req, res) => {
  db.query("select * from item", (err, result) => {
    if (err) {
      console.error("Error finding data:", err);
      return res.status(500).json({ message: "Error inserting data" });
    }
    res.status(200).json({
      message: "Get data successfully",
      id: result,
    });
  });
};

const updateItem = (req, res) => {
  try {
    console.log("Updating item");
    const query = `UPDATE item SET ItemName =? WHERE ID =?`;
    const values = [req.body.name, req.body.id];
    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Error finding data:", err);
        return res.status(500).json({ message: "Error Updating data" });
      }
      res.status(200).json({
        message: "Update data successfully",
        id: result,
      });
    });
  } catch (err) {
    if (err) {
      console.error("Error updating item:", err);
      return res.status(500).json({ message: "Error updating item" });
    }
  }
};

const DeleteItem = (req, res) => {
  try {
    const query = `DELETE FROM item WHERE ID =?`;
    const values = [req.params.id];
    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Error finding data:", err);
        return res.status(500).json({ message: "Error DELETING data" });
      }
      res.status(200).json({
        message: "Delete data successfully",
        id: result,
      });
    });
  } catch (err) {
    if (err) {
      console.error("Error deleting item:", err);
      return res.status(500).json({ message: "Error deleting item" });
    }
  }
};

module.exports = { setItem, getItem, updateItem, DeleteItem };
