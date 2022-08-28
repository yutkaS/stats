import fs from "fs";
// const catWife = require('../../assets/514079f2a125e7ceda7db595a933df70.jpeg');
import {sendPhoto} from "../chat/index.js";
import {file} from '../constants/index.js';

export const handleDayEnd = () => {
    const statsJson = fs.readFileSync(file, 'utf8');
    const {stats} = JSON.parse(statsJson);

    const usersProductivity = stats.map(({lettersCount, messagesCount, tag}) => ({
        userTag: tag,
        productivity: lettersCount / messagesCount,
    }));

    // переписать эту хуйню
    const bestWorker = usersProductivity.sort(
        ({productivity: productivity1}, {productivity: productivity2}) => productivity2 - productivity1
    )[0];

    const bestWorkerCongratulations = `${bestWorker.userTag}, партия гордится тобой! У тебя лучший коэффициент продуктивности - ${bestWorker.productivity.toFixed(2)}!`

    sendPhoto('AgACAgIAAxkBAAIH2GMKrP0pv4hxJU6ky5v9vaBcnJUmAAKSwDEbOHFYSBYkqkxtzEc1AQADAgADbQADKQQ', bestWorkerCongratulations)


}
