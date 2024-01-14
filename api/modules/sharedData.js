let vectorStore = null;
let retrievalChain = null;
const controllers = new Map();

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
    console.log("StoreController id: "+ id);
}

function getController(id) {
    console.log("Get Controller:" + id)
    return controllers.get(id);
}

function removeController(id) {
    controllers.delete(id);
}

module.exports = { setVectorStore, getVectorStore, setRetrievalChain, getRetrievalChain, storeController, getController, removeController};
