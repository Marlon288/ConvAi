import { v4 as uuidv4 } from "uuid";

const generateRequestId = () => {
    return uuidv4();
}

export default generateRequestId;