var express = require("express");
var router = express.Router();

require("dotenv").config();
var path = require("path");

var { TextLoader } = require("langchain/document_loaders/fs/text");
var { ChatOpenAI, OpenAIEmbeddings } = require("@langchain/openai");
var { ChatPromptTemplate, PromptTemplate } = require("@langchain/core/prompts");
var { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
var {
  createStuffDocumentsChain,
} = require("langchain/chains/combine_documents");
var {
  CloseVectorNode,
} = require("@langchain/community/vectorstores/closevector/node");
var { ConversationalRetrievalQAChain, loadQAStuffChain, RetrievalQAChain } = require("langchain/chains");
var { ConversationSummaryMemory } = require ("langchain/memory");
var { createRetrievalChain } = require("langchain/chains/retrieval");

const {
  getVectorStore,
  setVectorStore,
  setRetrievalChain,
  setModel,
} = require("../modules/sharedData");

async function initialize() {
  await initVectorStore();
  await initRetrievalChain();
  console.log("DONE");
}

async function initVectorStore() {
  const filePath = path.join(
    __dirname,
    "../data/TrainingData/HexagonDocumentation.txt"
  );
  const loader = new TextLoader(filePath);

  const docs = await loader.load();

  const splitter = new RecursiveCharacterTextSplitter();

  const splitDocs = await splitter.splitDocuments(docs);
  var vectorStore = await CloseVectorNode.fromDocuments(
    splitDocs,
    new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY })
  );
  setVectorStore(vectorStore);
}

async function initRetrievalChain() {

  const chatModel = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
   // modelName: "gpt-3.5-turbo",
    modelName: "gpt-4-1106-preview",
    temperature: 0.5,
    maxTokens: 500
  });

  setModel(chatModel);

  const prompt = ChatPromptTemplate.fromTemplate(`
  Chat History:
  <chat_history>
  {chat_history}
  </chat_history>

    Answer the following question based on the provided context and refer to the previous conversation, if required. 
  
    If the context is insufficient, use your general knowledge. 
    Clearly indicate whether your response is based on the provided documentation or general knowledge. 

    Return your answer in a HTML format, this is really important:
    - Use <ul> and <li> tags for bullet points or numbered lists.
    - Employ <b> tags for emphasizing bold text.
    - Utilize <h3> tags for headings. Use headings sensibly - only with related subtext or content.
    - Insert <br> tags for line breaks to visually separate items or steps.
    - For links, use the <a> tag w  ith the text "Source" as the anchor text and include the attribute target="_blank" so that links open in a new window. The actual URL should be in the href attribute of the <a> tag.
  
    Context:
    <context>
    {context}
    </context>



    Question: {input}
    
    
    Answer in HTML:
      `);
   /*const QA_CHAIN_PROMPT = new PromptTemplate({
        inputVariables: ["context", "question", "chat_history"],
        template,
    });
    const chain = new RetrievalQAChain({
      combineDocumentsChain: loadQAStuffChain(
        this.chatModel, {
        prompt: QA_CHAIN_PROMPT,
      }),
      retriever: getVectorStore().asRetriever(),
    }); */
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
  console.log("Chains Setup");
  setRetrievalChain(chain);
}

module.exports = { initialize };
