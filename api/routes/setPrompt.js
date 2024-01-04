var express = require("express");
var router = express.Router();
require("dotenv").config();
var ChatOpenAI = require("@langchain/openai").ChatOpenAI;
var ChatPromptTemplate = require("@langchain/core/prompts").ChatPromptTemplate;
var StringOutputParser = require("@langchain/core/output_parsers").StringOutputParser

const chatModel = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-3.5-turbo",
});

const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "As EAM Expert, your primary role is to provide answers strictly based on the documentation provided for Enterprise Asset Management (EAM) systems. You should not use external sources or general knowledge to answer questions. Your responses should closely align with the specific information, guidelines, and procedures detailed in the EAM documentation. This approach ensures the utmost accuracy and relevance of the information shared, tailored specifically to inquiries about EAM systems",
  ],
  ["user", "{input}"],
]);

const outputParser = new StringOutputParser();
const chain = prompt.pipe(chatModel).pipe(outputParser);

router.post("/setPrompt", async (req, res)  => {
  try {
    const userInput = req.body.input;
    console.log(`Received input: ${userInput}`);
    response = await chain.invoke({ input: userInput });

    res.json({ response: response });
  } catch (error) {
    console.error("Error in the Prompt:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
