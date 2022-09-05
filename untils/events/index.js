import fs from "fs";
import {sendPhoto} from "../chat/index.js";
import {file, defaultStage} from '../constants/index.js';

export const handleDayEnd = () => {
    const statsJson = fs.readFileSync(file, 'utf8');
    const {stats, settings} = JSON.parse(statsJson);

    // const randomWorker = stats[Math.floor(Math.random() * stats.length)];
    // if (!settings.hasTrashTalkToday) sendMessage(`По итогам сегодняшней смены, было выявлено отсутствие срача. Назначаю [${randomWorker.name}](tg://user?id=${randomWorker.id}) ответственным за срач на следующую смену.`)

    const usersProductivity = stats.map(({lettersCount, messagesCount, name, id}) => ({
        name: name,
        id: id,
        productivity: lettersCount / messagesCount,
    }));

    // переписать эту хуйню
    const bestWorker = usersProductivity.sort(
        ({productivity: productivity1}, {productivity: productivity2}) => productivity2 - productivity1
    )[0];

    const bestWorkerCongratulations = `[${bestWorker.name}](tg://user?id=${bestWorker.id}), партия гордится тобой! У тебя лучший коэффициент продуктивности - ${bestWorker.productivity.toFixed(2)}!`

    sendPhoto('AgACAgIAAxkBAAIH2GMKrP0pv4hxJU6ky5v9vaBcnJUmAAKSwDEbOHFYSBYkqkxtzEc1AQADAgADbQADKQQ', bestWorkerCongratulations)
    fs.writeFileSync(file, defaultStage);

    // переписать эту хуйню
    const defaultStatsJson = fs.readFileSync(file, 'utf8');
    const {stats: defaultStats, settings: defaultSettings} = JSON.parse(defaultStatsJson);
    defaultSettings.isStatSendToday = true;
    defaultSettings.lastReaded = settings.lastReaded;
    fs.writeFileSync(file, JSON.stringify({settings: defaultSettings, stats: defaultStats}));
}
