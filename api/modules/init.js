/**
 * @file init.js
 * @description Initialization module for the backend application, creates action chain of LangChain.
 * @author Marlon D'Ambrosio
 * @version 1.0
 */

var express = require("express");
var router = express.Router();
require("dotenv").config();
var path = require("path");
var { TextLoader } = require("langchain/document_loaders/fs/text");
var { ChatOpenAI, OpenAIEmbeddings } = require("@langchain/openai");
var { ChatPromptTemplate, PromptTemplate } = require("@langchain/core/prompts");
var { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
var { createStuffDocumentsChain } = require("langchain/chains/combine_documents");
var { CloseVectorNode } = require("@langchain/community/vectorstores/closevector/node");
var { ConversationalRetrievalQAChain, loadQAStuffChain, RetrievalQAChain } = require("langchain/chains");
var { ConversationSummaryMemory } = require("langchain/memory");
var { createRetrievalChain } = require("langchain/chains/retrieval");
const { getVectorStore, setVectorStore, setRetrievalChain, setModel } = require("../modules/sharedData");

/**
 * Initializes the application by setting up the vector store and retrieval chain.
 */
async function initialize() {
  await initVectorStore();
  await initRetrievalChain();
  console.log("DONE");
}

/**
 * Initializes the vector store by loading and splitting the training data.
 */
async function initVectorStore() {
  const filePath = path.join(__dirname, "../data/TrainingData/HexagonDocumentationSmallSet.txt");
  const loader = new TextLoader(filePath);
  const docs = await loader.load();
  const splitter = new RecursiveCharacterTextSplitter();
  const splitDocs = await splitter.splitDocuments(docs);
  var vectorStore = await CloseVectorNode.fromDocuments(splitDocs, new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY }));
  setVectorStore(vectorStore);
}

/**
 * Initializes the retrieval chain using the vector store and a chat model.
 */
async function initRetrievalChain() {
  const chatModel = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: "gpt-4-1106-preview",
    temperature: 0.92,
    maxTokens: 750
  });
  setModel(chatModel);
  const prompt = ChatPromptTemplate.fromTemplate(`
    Chat History:
    <chat_history>
      {chat_history}
    </chat_history>
    Answer the following question based on the provided context
    and refer to the previous conversation, if required.
    If the context is insufficient, use your general knowledge.
    Clearly indicate whether your response is based on the provided documentation or general knowledge.
    Return your answer in a HTML format, this is really important:
    - Use <ul> and <li> tags for bullet points or numbered lists.
    - Employ <b> tags for emphasizing bold text.
    - Utilize <h3> tags for headings. Use headings sensibly - only with related subtext or content.
    - Insert <br> tags for line breaks to visually separate items or steps.
    - For links, use the <a> tag with the text "Source" as the anchor text
      and include the attribute target="_blank" so that links open in a new window.
      The actual URL should be in the href attribute of the <a> tag.
    Context:
      <context>
        {context}
      </context>
    Question: {input}
    Your answer needs to be in the language the Input was asked in, but dont translate the system-specific terminology, keep that to the original. 
    If there is a described way to perform an action which is indicated by <Step 1> > <Step 2>, I want you to return that information in that style. 

    Answer in HTML:
      `);
  const documentChain = await createStuffDocumentsChain({
    llm: chatModel,
    prompt: prompt,
  });
  const retriever = getVectorStore().asRetriever();
  const chain = await createRetrievalChain({
    combineDocsChain: documentChain,
    retriever,
    streaming: true
  });
  setRetrievalChain(chain);
}

module.exports = { initialize };