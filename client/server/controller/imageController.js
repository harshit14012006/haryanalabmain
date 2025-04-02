// imageController.js
const db = require('../database/db');
const path = require('path');


// Function to save image details to the database
const saveImage = async (req, res) => {
  try {
    // Check if file is present
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Get the file details
    const imageName = req.file.filename;
    const imagePath = req.file.path;

    // Save image details to the database
    const [result] = await db.query(
      'INSERT INTO images (image_name, image_path) VALUES (?, ?)',
      [imageName, imagePath]
    );

    res.status(201).json({
      message: 'Image uploaded successfully',
      image: {
        id: result.insertId,
        name: imageName,
        path: imagePath
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { saveImage };
