import fs from "fs";
import {defaultStage, file} from "../constants/index.js";

export const init = () => {
    if (!fs.existsSync(file)) fs.appendFileSync(file, defaultStage, 'utf8');
}
