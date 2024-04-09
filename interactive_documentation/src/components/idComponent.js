/**
 * @file idComponent.js
 * @description This component generates a unique request ID using the UUID library.
 * @author Marlon D'Ambrosio
 * @version 1.0
 */

import { v4 as uuidv4 } from "uuid";

/**
 * Generates a unique request ID
 * @returns {string} The generated request ID
 */
const generateRequestId = () => {
  return uuidv4();
};

export default generateRequestId;