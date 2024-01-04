let vectorStore = null;
let retrievalChain = null;

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
  

module.exports = { setVectorStore, getVectorStore, setRetrievalChain, getRetrievalChain };
