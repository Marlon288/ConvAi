/**
 * @file sharedData.js
 * @description Shared data module for managing the vector store, retrieval chain, and controllers.
 * @author Marlon D'Ambrosio
 * @version 1.0
 */

var { OpenAI } = require("@langchain/openai");
var { ConversationSummaryMemory } = require("langchain/memory");

let vectorStore = null;
let retrievalChain = null;
const controllers = new Map();
let model = null;
const memoryBuffers = new Map();

/**
 * Sets the vector store.
 * @param {Object} store - The vector store object.
 */
function setVectorStore(store) {
  vectorStore = store;
}

/**
 * Gets the vector store.
 * @returns {Object} The vector store object.
 */
function getVectorStore() {
  return vectorStore;
}

/**
 * Sets the retrieval chain.
 * @param {Object} store - The retrieval chain object.
 */
function setRetrievalChain(store) {
  retrievalChain = store;
}

/**
 * Gets the retrieval chain.
 * @returns {Object} The retrieval chain object.
 */
function getRetrievalChain() {
  return retrievalChain;
}

/**
 * Stores a controller with the given ID.
 * @param {string} id - The ID of the controller.
 * @param {Object} controller - The controller object.
 */
function storeController(id, controller) {
  controllers.set(id, controller);
}

/**
 * Gets a controller with the given ID.
 * @param {string} id - The ID of the controller.
 * @returns {Object} The controller object.
 */
function getController(id) {
  console.log("Get Controller:" + id);
  return controllers.get(id);
}

/**
 * Removes a controller with the given ID.
 * @param {string} id - The ID of the controller.
 */
function removeController(id) {
  controllers.delete(id);
}

/**
 * Sets the model.
 * @param {Object} Model - The model object.
 */
function setModel(Model) {
  model = Model;
}

/**
 * Gets the model.
 * @returns {Object} A copy of the model object.
 */
function getModel() {
  return Object.assign({}, model);
}

/**
 * Sets up streaming for the model.
 * @param {Object} res - The response object.
 * @param {AbortSignal} signal - The abort signal for cancellation.
 */
function setupStreamingForModel(res, signal) {
  model.streaming = true;
  model.callbacks = [
    {
      handleLLMNewToken(token) {
        if (!signal.aborted) {
          res.write(token);
        } else {
          res.end();
        }
      },
    },
  ];
}

module.exports = {
  setVectorStore,
  getVectorStore,
  setRetrievalChain,
  getRetrievalChain,
  storeController,
  getController,
  removeController,
  setModel,
  getModel,
  setupStreamingForModel
};