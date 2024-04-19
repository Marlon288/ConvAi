const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { verifyToken } = require('./authRouter');

// Helper function to read the JSON file
function readPromptsData() {
  const jsonFilePath = path.join(__dirname, '../data/prompts.json');
  const jsonData = fs.readFileSync(jsonFilePath, 'utf8');
  return JSON.parse(jsonData);
}

// Route to get all prompts
router.get('/prompts', verifyToken, (req, res) => {
  try {
    const prompts = readPromptsData();
    res.json(prompts);
  } catch (error) {
    console.error('Error reading prompts data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to get prompts by country
router.get('/country/:country', verifyToken, (req, res) => {
  try {
    const { country } = req.params;
    const prompts = readPromptsData();
    const filteredPrompts = prompts.filter(prompt => prompt.Location.includes(country));
    res.json(filteredPrompts);
  } catch (error) {
    console.error('Error reading prompts data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to get prompts by location
router.get('/location/:location', verifyToken, (req, res) => {
  try {
    const { location } = req.params;
    const prompts = readPromptsData();
    const filteredPrompts = prompts.filter(prompt => prompt.Location.includes(location));
    res.json(filteredPrompts);
  } catch (error) {
    console.error('Error reading prompts data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to get prompts with performance worse than a certain number
router.get('/performance/worse/:threshold', (req, res) => {
    try {
      const { threshold } = req.params;
      const prompts = readPromptsData();
      const filteredPrompts = prompts.filter(prompt => prompt.Performance > parseFloat(threshold));
      res.json(filteredPrompts);
    } catch (error) {
      console.error('Error reading prompts data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Route to get prompts with performance better than a certain number
  router.get('/performance/better/:threshold', (req, res) => {
    try {
      const { threshold } = req.params;
      const prompts = readPromptsData();
      const filteredPrompts = prompts.filter(prompt => prompt.Performance < parseFloat(threshold));
      res.json(filteredPrompts);
    } catch (error) {
      console.error('Error reading prompts data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Route to get prompts with a specific rating
  router.get('/rating/:rating', (req, res) => {
    try {
      const { rating } = req.params;
      const prompts = readPromptsData();
      const filteredPrompts = prompts.filter(prompt => prompt.Rating === parseInt(rating));
      res.json(filteredPrompts);
    } catch (error) {
      console.error('Error reading prompts data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Route to get prompts with a rating equal to or higher than a certain number
  router.get('/rating/equalOrHigher/:rating', (req, res) => {
    try {
      const { rating } = req.params;
      const prompts = readPromptsData();
      const filteredPrompts = prompts.filter(prompt => prompt.Rating >= parseInt(rating));
      res.json(filteredPrompts);
    } catch (error) {
      console.error('Error reading prompts data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Route to get prompts with a rating equal to or lower than a certain number
  router.get('/prompts/rating/equalOrLower/:rating', (req, res) => {
    try {
      const { rating } = req.params;
      const prompts = readPromptsData();
      const filteredPrompts = prompts.filter(prompt => prompt.Rating <= parseInt(rating));
      res.json(filteredPrompts);
    } catch (error) {
      console.error('Error reading prompts data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  
  // Route to get prompts for download based on selected location and date range
  router.get("/prompts/download", verifyToken, (req, res) => {
    try {
      const { location, startDate, endDate } = req.query;
      const prompts = readPromptsData();
      let filteredPrompts = prompts;
      if (location && location !== "global") {
        filteredPrompts = filteredPrompts.filter((prompt) =>
          prompt.Location.includes(location)
        );
      }
      if (startDate && endDate) {
        filteredPrompts = filteredPrompts.filter((prompt) => {
          const promptDate = new Date(prompt.DateTime);
          return promptDate >= new Date(startDate) && promptDate <= new Date(endDate);
        });
      }
      res.json(filteredPrompts);
    } catch (error) {
      console.error("Error reading prompts data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
  router.post("/usage", verifyToken, (req, res) => {
    try {
      const { location } = req.body;
      const prompts = readPromptsData();
      let filteredPrompts = prompts;
      if (location && location !== "global") {
        filteredPrompts = filteredPrompts.filter((prompt) =>
          prompt.Location.includes(location)
        );
      }
      const usageData = filteredPrompts.reduce((acc, prompt) => {
        const date = prompt.DateTime.split("T")[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});
      res.json(usageData);
    } catch (error) {
      console.error("Error reading prompts data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
  // Route to get average rating based on selected location
  router.get("/average-rating", verifyToken, (req, res) => {
    try {
      const { location } = req.query;
      const prompts = readPromptsData();
      let filteredPrompts = prompts;
      if (location && location !== "global") {
        filteredPrompts = filteredPrompts.filter((prompt) =>
          prompt.Location.includes(location)
        );
      }
      const totalRating = filteredPrompts.reduce((sum, prompt) => sum + prompt.Rating, 0);
      const averageRating = totalRating / filteredPrompts.length;
      res.json({ averageRating });
    } catch (error) {
      console.error("Error reading prompts data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

module.exports = router;