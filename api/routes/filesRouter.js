/**
 * @file filesRouter.js
 * @description Files router module for handling file-related routes.
 * @author Marlon D'Ambrosio
 * @version 1.0
 */

const express = require('express');
const router = express.Router();
const { verifyToken } = require('./authRouter');

// Example hardcoded data
const files = [
  { name: "Trainingset1.txt", lastUpdated: "2024-01-01" },
  { name: "Trainingset2.txt", lastUpdated: "2024-02-01" },
  { name: "Trainingset3.txt", lastUpdated: "2024-02-01" },
  { name: "Trainingset4.txt", lastUpdated: "2024-02-01" },
  { name: "Trainingset5.txt", lastUpdated: "2024-02-01" },
  { name: "Trainingset6.txt", lastUpdated: "2024-02-01" },
  { name: "Trainingset7.txt", lastUpdated: "2024-02-01" }
];

/**
 * Route for getting the list of files.
 */
router.get('/files', verifyToken, (req, res) => {
  res.json(files);
});

/**
 * Route for adding a file (simulated).
 */
router.post('/files', verifyToken, (req, res) => {
  const { name, lastUpdated } = req.body;
  files.push({ name, lastUpdated });
  res.status(201).send('File added successfully');
});

/**
 * Route for deleting a file (simulated).
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