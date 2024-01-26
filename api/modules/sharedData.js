var { OpenAI } = require("@langchain/openai");
var { ConversationSummaryMemory } = require("langchain/memory");

let vectorStore = null;
let retrievalChain = null;
const controllers = new Map();
let model = null;
const memoryBuffers = new Map();

function setVectorStore(store) {
  vectorStore = store;
}

function getVectorStore() {
  return vectorStore;
}

function setRetrievalChain(store) {
    retrievalChain = store;
  }
  
  function getRetrievalChain () {
    return retrievalChain;
}

function storeController(id, controller) {
    controllers.set(id, controller);
}

function getController(id) {
    console.log("Get Controller:" + id)
    return controllers.get(id);
}

function removeController(id) {
    controllers.delete(id);
}
function setModel(Model){
  model = Model;
}
function getModel(){
  return Object.assign({}, model);
}


function setupStreamingForModel(res) {
  model.streaming = true;
  model.callbacks = [
    {
      handleLLMNewToken(token) {
        res.write(token);
      },
    },
  ];
}

module.exports = { setVectorStore, getVectorStore, setRetrievalChain, getRetrievalChain, storeController, getController, removeController, setModel, getModel, setupStreamingForModel};
