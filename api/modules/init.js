var express = require("express");
var router = express.Router();

require("dotenv").config();
var path = require("path");

var {TextLoader} = require("langchain/document_loaders/fs/text");
var { ChatOpenAI,OpenAIEmbeddings } = require("@langchain/openai");
var { ChatPromptTemplate } = require("@langchain/core/prompts");
var { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
var { createStuffDocumentsChain } = require("langchain/chains/combine_documents");
var {CloseVectorNode} =   require("@langchain/community/vectorstores/closevector/node");
var { createRetrievalChain } = require("langchain/chains/retrieval");

const { getVectorStore, setVectorStore, setRetrievalChain } = require("../modules/sharedData");

async function initialize() {
  await initVectorStore();
  await initRetrievalChain();
  console.log("DONE");
}

async function initVectorStore() {
  const filePath = path.join(
    __dirname,
    "../data/TrainingData/HexagonDocumentationSmallSet.txt"
  );
  const loader = new TextLoader(filePath);

  const docs = await loader.load();

  const splitter = new RecursiveCharacterTextSplitter();

  const splitDocs = await splitter.splitDocuments(docs);
  console.log("Breakpoint 1");
  var vectorStore = await CloseVectorNode.fromDocuments(
    splitDocs,
    new OpenAIEmbeddings({openAIApiKey: process.env.OPENAI_API_KEY})
  );
  console.log("Breakpoint 2");
  setVectorStore(vectorStore);
}

async function initRetrievalChain() {

    
//const outputParser = new StringOutputParser();
//const chain = prompt.pipe(chatModel).pipe(outputParser);


  const chatModel = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: "gpt-3.5-turbo",
  });

  const prompt =
    ChatPromptTemplate.fromTemplate(`Answer the following question based only on the provided context:

      <context>
      {context}
      </context>
      
      Question: {input}`);

  const documentChain = await createStuffDocumentsChain({
    llm: chatModel,
    prompt,
  });
  console.log("Breakpoint 3");
  const retriever = getVectorStore().asRetriever();
  const retrievalChain = await createRetrievalChain({
    combineDocsChain: documentChain,
    retriever,
  });
  console.log("Breakpoint 4");
  setRetrievalChain(retrievalChain);
}


module.exports = { initialize };
