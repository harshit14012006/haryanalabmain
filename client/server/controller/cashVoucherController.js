// /controller/cashVoucherController.js
const db = require('../database/db');

const createCashVoucher = (req, res) => {
  const { date, partyname, amount, remarks } = req.body;

  const query = `INSERT INTO cashvoucher (date, partyname, amount, remarks) VALUES (?, ?, ?, ?)`;

  const values = [date, partyname, amount, remarks];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res.status(500).json({ message: 'Error inserting data' });
    }
    res.status(201).json({ message: 'Cash voucher created successfully', id: result.insertId });
  });
};
const getCashVouchers = (req, res) => {
    const query = 'SELECT * FROM cashvoucher';
  
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching data:', err);
        return res.status(500).json({ message: 'Error fetching data' });
      }
      res.status(200).json(results);
    });
  };
module.exports = { createCashVoucher ,getCashVouchers};
