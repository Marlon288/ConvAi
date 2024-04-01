var express = require("express");
var router = express.Router();
require("dotenv").config();
const {
  getRetrievalChain,
  storeController,
  getController,
  removeController,
  setupStreamingForModel
} = require("../modules/sharedData");



router.post("/setPrompt", async (req, res) => {
  const requestId = req.body.id;
  if (!requestId) {
    return res.status(400).send("Request ID is missing");
  }


  const controller = new AbortController();
  storeController(requestId, controller);

  try {
    const history = req.body.history || [];
    const userInput = req.body.input;
    
    const limitedHistory = history.slice(-6); // Adjust this number as needed
    console.log(limitedHistory);
    setupStreamingForModel(res);
    
    const response = await getRetrievalChain().invoke({
      input: userInput,
      chat_history: limitedHistory,
      signal: controller.signal
    });
    console.log(response);
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

router.post("/cancelRequest", (req, res) => {
  const { requestId } = req.body; // Get the request ID from the request body

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
      // In case the request was already aborted
      res.status(500).send("Request was already cancelled");
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  } finally {
    removeController(requestId);
  }
});

module.exports = router;
