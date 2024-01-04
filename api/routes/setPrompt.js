var express = require("express");
var router = express.Router();
require("dotenv").config();
const { getRetrievalChain } = require('../modules/sharedData');

router.post("/setPrompt", async (req, res)  => {
  try {
    const userInput = req.body.input;
    console.log(`Received input: ${userInput}`);
    response = await getRetrievalChain().invoke({ input: userInput });
    res.json({ response: response.answer });
  } catch (error) {
    console.error("Error in the Prompt:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
