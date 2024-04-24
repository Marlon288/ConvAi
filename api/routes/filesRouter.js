/**
 * @file filesRouter.js
 * @description Files router module for handling file routes.
 * @author Marlon D'Ambrosio
 * @version 1.0
 */

const express = require('express');
const router = express.Router();
const { verifyToken } = require('./authRouter');

// Example hardcoded data
const files = [
  { name: "Trainingset1.txt", lastUpdated: "2024-01-01",  location: "Glasgow" },
  { name: "Trainingset2.txt", lastUpdated: "2024-02-01",  location: "Glasgow" },
  { name: "Trainingset3.txt", lastUpdated: "2024-02-01",  location: "Glasgow" },
  { name: "Trainingset4.txt", lastUpdated: "2024-02-01",  location: "Glasgow" },
  { name: "Trainingset5.txt", lastUpdated: "2024-02-01" ,  location: "Glasgow"},
  { name: "Test Set 3.pdf", lastUpdated: "2024-02-01" ,  location: "Frauenfeld"},
  { name: "Test Set 1.pdf", lastUpdated: "2024-02-01",  location: "Frauenfeld" },
  { name: "Test Set 2.pdf", lastUpdated: "2024-02-01", location: "Frauenfeld" }                             
];

/**
 * GET /api/protected/files
 * @summary Get the list of files
 * @tag File Management
 * @security bearerAuth
 * @returns {Array} 200 - The list of files
 */
router.get('/files', verifyToken, (req, res) => {
  res.json(files);
});

/**
 * POST /api/protected/files
 * @summary Add a file (simulated in local JSON)
 * @tag File Management 
 * @security bearerAuth
 * @param {string} request.body.required - The name of the file
 * @param {string} request.body.required - The last updated date of the file
 * @returns {string} 201 - File added successfully
 */
router.post('/files', verifyToken, (req, res) => {
  const { name, lastUpdated } = req.body;
  files.push({ name, lastUpdated });
  res.status(201).send('File added successfully');
});

/**
 * DELETE /api/protected/files/{name}
 * @summary Delete a file (simulated in local JSON)
 * @tag File Management 
 * @security bearerAuth
 * @param {string} name.path.required - The name of the file to delete
 * @returns {string} 200 - File deleted successfully
 * @returns {string} 404 - File not found
 */
router.delete('/files/:name', verifyToken, (req, res) => {
  const { name } = req.params;
  const index = files.findIndex(file => file.name === name);
  if (index !== -1) {
    files.splice(index, 1);
    res.send('File deleted successfully');
  } else {
    res.status(404).send('File not found');
  }
});

module.exports = router;