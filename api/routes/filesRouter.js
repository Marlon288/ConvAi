const express = require('express');
const router = express.Router();
const {verifyToken} = require('./authRouter'); // Adjust the path as needed if verifyToken is moved

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

router.get('/files', verifyToken, (req, res) => {
  res.json(files);
});

// POST method to add a file (simulated)
router.post('/files', verifyToken, (req, res) => {
  const { name, lastUpdated } = req.body; // In a real scenario, you would save this information to a database
  files.push({ name, lastUpdated }); // Simulating adding to an array for this example
  res.status(201).send('File added successfully');
});

// DELETE method to delete a file (simulated)
router.delete('/files/:name', verifyToken, (req, res) => {
  // Simulate deleting a file (this wouldn't actually delete a file in this example)
  const { name } = req.params;
  const index = files.findIndex(file => file.name === name);
  if (index !== -1) {
    files.splice(index, 1); // Simulating deletion from an array for this example
    res.send('File deleted successfully');
  } else {
    res.status(404).send('File not found');
  }
});

module.exports = router;
