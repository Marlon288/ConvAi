/**
 * @file aiHandler.js
 * @description AI handler module for processing and responding to AI-related requests.
 * @author Marlon D'Ambrosio
 * @version 1.0
 */

var express = require("express");
var router = express.Router();
const path = require('path');
const fs = require("fs");
require("dotenv").config();
const {
  getRetrievalChain,
  storeController,
  getController,
  removeController,
  setupStreamingForModel
} = require("../modules/sharedData");

/**
 * Route for setting a prompt and generating a response.
 */
router.post("/setPrompt", async (req, res) => {
  const requestId = req.body.id;
  if (!requestId) {
    return res.status(400).send("Request ID is missing");
  }
  const controller = new AbortController();
  storeController(requestId, controller);
  try {
    const startTime = performance.now();
    const history = req.body.history || [];
    const userInput = req.body.input;
    const limitedHistory = history.slice(-6);
    console.log(limitedHistory);
    setupStreamingForModel(res);
    const response = await getRetrievalChain().invoke({
      input: userInput,
      chat_history: limitedHistory,
      signal: controller.signal
    });
    const endTime = performance.now();
    const responseTime = (endTime - startTime) / 1000;
    console.log(response);
    const promptEntry = {
      Prompt: userInput,
      Answer: response.answer,
      Performance: responseTime,
      LLM: "gpt-4-1106-preview"
    };
    const jsonFilePath = path.join(__dirname, "../data/prompts.json");
    let prompts = [];
    if (fs.existsSync(jsonFilePath)) {
      const jsonData = fs.readFileSync(jsonFilePath, "utf8");
      prompts = JSON.parse(jsonData);
    }
    prompts.push(promptEntry);
    fs.writeFileSync(jsonFilePath, JSON.stringify(prompts, null, 2), "utf8");
  } catch (error) {
    if (error.name === "AbortError") {
      console.log("Request was cancelled");
      res.status(500).send("Request cancelled");
    } else {
      console.error("Error in the Prompt:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } finally {
    removeController(requestId);
    res.end();
  }
});

/**
 * Route for cancelling a request.
 */
router.post("/cancelRequest", (req, res) => {
  const { requestId } = req.body;
  if (!requestId) {
    return res.status(400).send("Request ID is missing");
  }
  try {
    const controller = getController(requestId);
    if (!controller) {
      return res.status(404).send("Request ID not found");
    }
    controller.abort();
    res.json({ message: "Request cancelled" });
  } catch (error) {
    console.error("Error in cancelling the request:", error);
    if (error.name === "AbortError") {
      res.status(500).send("Request was already cancelled");
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  } finally {
    removeController(requestId);
  }
});

module.exports = router;