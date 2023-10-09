import fs from "fs";
import {file} from "../constants/index.js";

export const getData = () => {
    const statsJson = fs.readFileSync(file, 'utf8');
    const {stats, settings} = JSON.parse(statsJson);

    return {stats, settings};
}
