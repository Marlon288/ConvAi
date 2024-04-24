/**
 * @file analyticsRouter.js
 * @description Express router for handling analytics-related routes.
 * @author Marlon D'Ambrosio
 * @version 1.0
 */

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { verifyToken } = require('./authRouter');
const { removeStopwords } = require('stopword');

/**
 * Reads the prompts data from the JSON file.
 * @returns {Object} The parsed prompts data.
 */
function readPromptsData() {
  const jsonFilePath = path.join(__dirname, '../data/prompts.json');
  const jsonData = fs.readFileSync(jsonFilePath, 'utf8');
  return JSON.parse(jsonData);
}

/**
 * GET /api/protected/analytics/prompts
 * @summary Get all prompts
 * @tags Analytic
 * @security bearerAuth
 * @returns {Object} 200 - The prompts data
 * @returns {Object} 500 - Internal Server Error
 */
router.get('/prompts', verifyToken, (req, res) => {
  try {
    const prompts = readPromptsData();
    res.json(prompts);
  } catch (error) {
    console.error('Error reading prompts data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * GET /api/protected/analytics/country/{country}
 * @summary Get prompts by country
 * @tags Analytic
 * @security bearerAuth
 * @param {string} country.path.required - The country to filter prompts by
 * @returns {Object} 200 - The filtered prompts data
 * @returns {Object} 500 - Internal Server Error
 */
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

/**
 * GET /api/protected/analytics/location/{location}
 * @summary Get prompts by location
 * @tags Analytic
 * @security bearerAuth
 * @param {string} location.path.required - The location to filter prompts by
 * @returns {Object} 200 - The filtered prompts data
 * @returns {Object} 500 - Internal Server Error
 */
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

/**
 * POST /api/protected/analytics/usage
 * @summary Get usage data
 * @tags Analytic
 * @security bearerAuth
 * @param {string} request.body - The location to filter usage data by
 * @returns {Object} 200 - The usage data
 * @returns {Object} 500 - Internal Server Error
 */
router.post("/usage", verifyToken, (req, res) => {
  try {
    const { location } = req.body;
    console.log("Location" + location);
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

/**
 * GET /api/protected/analytics/rating-counts
 * @summary Get rating counts of the prompts
 * @tags Analytic
 * @security bearerAuth
 * @param {string} location.query - The location to filter rating counts by
 * @returns {Object} 200 - The rating counts data
 * @returns {Object} 500 - Internal Server Error
 */
router.get("/rating-counts", verifyToken, (req, res) => {
  try {
    const { location } = req.query;
    const prompts = readPromptsData();
    let filteredPrompts = prompts;

    if (location && location !== "global") {
      filteredPrompts = filteredPrompts.filter((prompt) =>
        prompt.Location.includes(location)
      );
    }

    const ratingCounts = filteredPrompts.reduce((acc, prompt) => {
      acc[prompt.Rating] = (acc[prompt.Rating] || 0) + 1;
      return acc;
    }, {});

    const ratingData = [
      { rating: 1, count: ratingCounts[1] || 0 },
      { rating: 2, count: ratingCounts[2] || 0 },
      { rating: 3, count: ratingCounts[3] || 0 },
      { rating: 4, count: ratingCounts[4] || 0 },
      { rating: 5, count: ratingCounts[5] || 0 },
    ];

    res.json(ratingData);
  } catch (error) {
    console.error("Error generating rating data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * GET /api/protected/analytics/word-frequency
 * @summary Get word frequency data
 * @tags Analytic
 * @security bearerAuth
 * @param {string} location.query - The location to filter word frequency data by
 * @returns {Object} 200 - The word frequency data
 * @returns {Object} 500 - Internal Server Error
 */
router.get("/word-frequency", verifyToken, (req, res) => {
  try {
    const { location } = req.query;
    const prompts = readPromptsData();
    let filteredPrompts = prompts;

    if (location && location !== "global") {
      filteredPrompts = filteredPrompts.filter((prompt) =>
        prompt.Location.includes(location)
      );
    }

    const wordFrequency = filteredPrompts.reduce((acc, prompt) => {
      const words = removeStopwords(prompt.Prompt.toLowerCase().replace(/[^a-zA-Z ]/g, "").split(/\s+/));
      const filteredWords = words.filter((word) => word.length > 3);

      filteredWords.forEach((word) => {
        acc[word] = (acc[word] || 0) + 1;
      });

      return acc;
    }, {});

    const frequencyData = Object.entries(wordFrequency).map(([keyword, amount]) => ({
      keyword,
      amount,
    }));

    res.json(frequencyData);
  } catch (error) {
    console.error("Error generating word frequency data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;