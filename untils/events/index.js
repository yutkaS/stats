import fs from "fs";
import {sendPhoto} from "../chat/index.js";
import {file, defaultStage} from '../constants/index.js';

export const handleDayEnd = () => {
    const statsJson = fs.readFileSync(file, 'utf8');
    const {stats, settings} = JSON.parse(statsJson);

    // const randomWorker = stats[Math.floor(Math.random() * stats.length)];
    // if (!settings.hasTrashTalkToday) sendMessage(`По итогам сегодняшней смены, было выявлено отсутствие срача. Назначаю [${randomWorker.name}](tg://user?id=${randomWorker.id}) ответственным за срач на следующую смену.`)

    const getPoints = (stat) => {
        let points = 0;

        // переписать эту хуйню
        if (stat.stickersCount) points += stat.stickersCount * 2;
        if (stat.photosCount) points += stat.photosCount * 2;
        if (stat.messagesCount) points += stat.messagesCount * 0.25;
        if (stat.voicesCount) points += stat.voicesCount * -10;

        return points;
    }
    // переписать эту хуйню

    const usersPoints = stats.map((stat) => ({
        points: getPoints(stat),
        name: stat.name,
        id: stat.id,
    }))

    const bestWorker = usersPoints.sort(
        ({points: points1}, {points: points2}) => points2 - points1
    )[0];

    const bestWorkerCongratulations = `[${bestWorker.name}](tg://user?id=${bestWorker.id}), партия гордится тобой! У тебя лучший коэффициент продуктивности - ${bestWorker.points}!`

    sendPhoto('AgACAgIAAxkBAAIH2GMKrP0pv4hxJU6ky5v9vaBcnJUmAAKSwDEbOHFYSBYkqkxtzEc1AQADAgADbQADKQQ', bestWorkerCongratulations)
    fs.writeFileSync(file, defaultStage);

    // переписать эту хуйню
    const defaultStatsJson = fs.readFileSync(file, 'utf8');
    const {stats: defaultStats, settings: defaultSettings} = JSON.parse(defaultStatsJson);
    defaultSettings.isStatSendToday = true;
    defaultSettings.lastReaded = settings.lastReaded;
    fs.writeFileSync(file, JSON.stringify({settings: defaultSettings, stats: defaultStats}));
}
