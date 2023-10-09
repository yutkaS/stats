import {getData} from "./index.js";
import {isProd} from "../constants/index.js";

export const checkToSendStats = () => {
    const {settings} = getData();

    return isProd ? (new Date().getHours() > 19 && !settings.isStatSendToday) : true
}
