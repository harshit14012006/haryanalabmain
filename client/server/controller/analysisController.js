// /controller/analysisController.js
const db = require("../database/db");

// Function to create a new analysis record
const createAnalysis = (req, res) => {
  const {
    Reportno,
    Samplename,
    Billeddate,
    Dated,
    Selected,
    From,
    Station,
    AnotherName,
    AnotherValue,
    Moisture,
    Oil,
    FFA,
    Time,
    Code,
    Date,
    Vechileno,
    Bags,
    Weight,
    Itemcategory,
    Remarks,
    Signature,
    SealEngraved,
  } = req.body;

  // const query = `INSERT INTO analysis ( Samplename, Billeddate, Dated, Sealunseal, \`From\`, Station, Crude, Moisture, Oil, FFA, \`Time\`,
  //   Code, \`Date\`, Vechileno, Bags, Weight, Itemcategory, Remarks, Signature
  // ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const query = `
  INSERT INTO analysis (
    Reportno, Samplename, Billeddate, Dated, Selected, \`From\`, Station, AnotherName,
    AnotherValue, Moisture, Oil, FFA, \`Time\`,
    Code, \`Date\`, Vechileno, Bags, Weight, Category, Remarks, Signature, SealEngraved
  ) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?);
`;

  const values = [
    Reportno,
    Samplename,
    Billeddate,
    Dated,
    Selected,
    From,
    Station,
    AnotherName,
    AnotherValue,
    Moisture,
    Oil,
    FFA,
    Time,
    Code,
    Date,
    Vechileno,
    Bags,
    Weight,
    Itemcategory,
    Remarks,
    Signature,
    SealEngraved,
  ];

  console.log(values);

  try {
    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Error inserting data:", err);
        return res.status(500).json({ message: "Error inserting data" });
      }
      console.log("saved sucessfully");
      res.status(201).json({
        message: "Analysis record created successfully",
        id: result.insertId,
      });
      console.log(req.body);
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all analysis records
const getAnalysis = (req, res) => {
  const { Reportno } = req.params;

  try {
    const query = `SELECT * FROM analysis WHERE Reportno = ?`;

    db.query(query, [Reportno], (err, results) => {
      if (err) {
        console.error("Error retrieving data:", err);
        return res.status(500).json({ message: "Error retrieving data" });
      }

      if (results.length === 0) {
        return res.status(201).json({
          message: "No records found for the given reportno",
          response: false,
        });
      }

      res.status(200).json({
        message: "Data retrieved successfully",
        data: results,
        response: true,
      });
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAnalysisnormal = (req, res) => {
  try {
    const query = `SELECT MAX(Reportno) AS Reportno FROM analysis;
 `;

    db.query(query, (err, results) => {
      if (err) {
        console.error("Error retrieving data:", err);
        return res.status(500).json({ message: "Error retrieving data" });
      }

      if (results.length === 0) {
        return res
          .status(404)
          .json({ message: "No records found for the given reportno" });
      }

      res
        .status(200)
        .json({ message: "Data retrieved successfully", data: results });
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Function to update an existing analysis record based on Reportno from query params
const updateAnalysis = (req, res) => {
  const {
    Samplename,
    Billeddate,
    Dated,
    Selected,
    From,
    Station,
    AnotherName,
    AnotherValue,
    Moisture,
    Oil,
    FFA,
    Time,
    Code,
    Date,
    Vechileno,
    Bags,
    Weight,
    Category,
    Remarks,
    Signature,
    SealEngraved,
  } = req.body;
  console.log(req.params);
  const { Reportno } = req.params; // Get the Reportno from query parameters

  const query = `UPDATE analysis SET
    Samplename = ?, Billeddate = ?, Dated = ?, Selected = ?, \`From\` = ?, Station = ?, AnotherName = ?, AnotherValue = ?, 
    Moisture = ?,  Oil = ?, FFA = ?, \`Time\` = ?, Code = ?, \`Date\` = ?, Vechileno = ?, 
    Bags = ?, Weight = ?, Category = ?, Remarks = ?, Signature = ?, SealEngraved = ?
    WHERE Reportno = ?`;

  const values = [
    Samplename,
    Billeddate,
    Dated,
    Selected,
    From,
    Station,
    AnotherName,
    AnotherValue,
    Moisture,
    Oil,
    FFA,
    Time,
    Code,
    Date,
    Vechileno,
    Bags,
    Weight,
    Category,
    Remarks,
    Signature,
    SealEngraved,
    Reportno,
  ];
  try {
    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Error updating data:", err);
        return res.status(500).json({ message: "Error updating data" });
      }
      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "No record found with the provided Reportno" });
      }
      res.status(200).json({ message: "Analysis record updated successfully" });
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getRepNo = async (req, res) => {
  console.log("Working");
  console.log(req.params.from);
  const Query = `SELECT Reportno FROM analysis WHERE \`From\` = ? `;
  db.query(Query, req.params.from, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
};

const getUserFromReport = async (req, res) => {
  const { startDate, endDate, partyName, sampleName } = req.body;

  try {
    // Validate input
    if (!startDate || !endDate || !partyName || !sampleName) {
      return res.status(400).json({
        error: "Please provide startDate, endDate, partyName, and sampleName",
      });
    }

    // Prepare the query
    const query = `
      SELECT c.party_name, a.sample_name
      FROM analysis a
      JOIN customer c ON a.customer_id = c.id
      WHERE a.date BETWEEN ? AND ?
      AND c.party_name = ?
      AND a.sample_name = ?
    `;

    // Execute the query in a promise to handle async execution
    const results = await new Promise((resolve, reject) => {
      db.query(
        query,
        [startDate, endDate, partyName, sampleName],
        (err, results) => {
          if (err) return reject(err); // Reject the promise if there's an error
          resolve(results); // Resolve with the results if successful
        }
      );
    });

    // Handle case where no records are found
    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: "No records found for the given criteria" });
    }

    // Return the results
    res.status(200).json(results);
  } catch (err) {
    console.error("Error executing query:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};
const getUserFromReportWithoutSample = async (req, res) => {
  const { startDate, endDate, partyName } = req.body;

  try {
    // Validate input
    if (!startDate || !endDate || !partyName) {
      return res
        .status(400)
        .json({ error: "Please provide startDate, endDate, and partyName" });
    }

    // Prepare the query
    const query = `
      SELECT c.party_name, a.sample_name
      FROM analysis a
      JOIN customer c ON a.customer_id = c.id
      WHERE a.date BETWEEN ? AND ?
      AND c.party_name = ?
    `;

    // Execute the query in a promise to handle async execution
    const results = await new Promise((resolve, reject) => {
      db.query(query, [startDate, endDate, partyName], (err, results) => {
        if (err) return reject(err); // Reject the promise if there's an error
        resolve(results); // Resolve with the results if successful
      });
    });

    // Handle case where no records are found
    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: "No records found for the given criteria" });
    }

    // Return the results
    res.status(200).json(results);
  } catch (err) {
    console.error("Error executing query:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getReportByDate = (req, res) => {
  const { startDate, endDate, partyName, sampleName } = req.body;
  console.log("Input values:", { startDate, endDate, partyName, sampleName });

  if (!startDate || !endDate) {
    return res
      .status(400)
      .json({ error: "Please provide startDate and endDate." });
  }

  const query = `
    SELECT * FROM analysis
    WHERE \`From\` = ? AND Samplename = ? AND STR_TO_DATE(Dated, '%d-%m-%Y') BETWEEN STR_TO_DATE(?, '%d-%m-%Y') AND STR_TO_DATE(?, '%d-%m-%Y')
  `;

  console.log("Executing SQL query:", query);
  console.log("With parameters:", [partyName, sampleName, startDate, endDate]);

  db.query(
    query,
    [partyName, sampleName, startDate, endDate],
    (err, results) => {
      if (err) {
        console.error("Error fetching data:", err);
        return res.status(500).json({ error: "Database query failed." });
      } else {
        console.log("Query results:", results);
        res.json(results);
      }
    }
  );
};

const getReportByPartyname = (req, res) => {
  const { startDate, endDate, partyName } = req.body;
  console.log(startDate, endDate, partyName);
  if (!startDate || !endDate) {
    return res
      .status(400)
      .json({ error: "Please provide startDate and endDate." });
  }

  const query = `
    SELECT * FROM analysis
    WHERE \`From\` = ?  AND STR_TO_DATE(Dated, '%d-%m-%Y') BETWEEN STR_TO_DATE(?, '%d-%m-%Y') AND STR_TO_DATE(?, '%d-%m-%Y')
  `;

  db.query(query, [partyName, startDate, endDate], (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      return res.status(500).json({ error: "Database query failed." });
    }
    res.json(results);
  });
};

const getReportSByEverything = (req, res) => {
  const {
    From,
    Selected,
    Samplename,
    Signature,
    Category,
    FromDate,
    ToDate,
    RepFrom,
    RepTo,
  } = req.body;
  // if (!startDate || !endDate) {
  //   return res
  //     .status(400)
  //     .json({ error: "Please provide startDate and endDate." });
  // }

  const query = `
    SELECT * FROM analysis
    WHERE \`From\` = ?  AND Selected = ? AND Samplename = ? AND Signature = ? AND Category = ? AND Reportno BETWEEN ? AND ? AND STR_TO_DATE(Billeddate, '%d-%m-%Y') BETWEEN STR_TO_DATE(?, '%d-%m-%Y') AND STR_TO_DATE(?, '%d-%m-%Y')
  `;
  console.log(
    From,
    Selected,
    Samplename,
    Signature,
    Category,
    RepFrom,
    RepTo,
    FromDate,
    ToDate
  );
  db.query(
    query,
    [
      From,
      Selected,
      Samplename,
      Signature,
      Category,
      RepFrom,
      RepTo,
      FromDate,
      ToDate,
    ],
    (err, results) => {
      if (err) {
        console.error("Error fetching data:", err);
        return res.status(500).json({ error: "Database query failed." });
      }
      res.json(results);
    }
  );
};

module.exports = {
  createAnalysis,
  getAnalysis,
  updateAnalysis,
  getAnalysisnormal,
  getRepNo,
  getReportByDate,
  getReportByPartyname,
  getReportSByEverything,
};
