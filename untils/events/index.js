import fs from "fs";
import {sendPhoto} from "../chat/index.js";
import {file, defaultStage} from '../constants/index.js';
import {getUsersPoints} from "../data/index.js";
import {getData} from "../else/index.js";
import {getUserTag} from "../chat/messages/index.js";

export const handleDayEnd = () => {
    const {stats, settings} = getData();

    // если небыло сообщений, то стату отправлять не нужно
    if (!stats.length) return

    // const randomWorker = stats[Math.floor(Math.random() * stats.length)];
    // if (!settings.hasTrashTalkToday) sendMessage(`По итогам сегодняшней смены, было выявлено отсутствие срача. Назначаю [${randomWorker.name}](tg://user?id=${randomWorker.id}) ответственным за срач на следующую смену.`)


    const workerRating = getUsersPoints().sort(
        ({points: points1}, {points: points2}) => points2 - points1
    );

    const bestWorker = workerRating[0];
    const semiBestWorker = workerRating[1];
    const bestUserTag = getUserTag(bestWorker.name, bestWorker.id);

    let congratulations
    switch (bestWorker.id) {
        case (149254493):
            congratulations = `[лох](tg://user?id=149254493), партия игнорит тебя! Лучшим за смену становиться ${getUserTag(semiBestWorker.name, semiBestWorker.id)}`;
            break
        case (323779471):
            congratulations = `${bestUserTag}, производство гордится тобой! И выдает тебе не 3 или 7, а ${bestWorker.points} прокоинов!`;
            break
        default:
            congratulations = `${bestUserTag} партия гордится тобой! За отличную работу, партия выдает тебе ${bestWorker.points} прокоинов!`;
    }

    sendPhoto('AgACAgIAAxkBAAIH2GMKrP0pv4hxJU6ky5v9vaBcnJUmAAKSwDEbOHFYSBYkqkxtzEc1AQADAgADbQADKQQ', congratulations);
    fs.writeFileSync(file, defaultStage);

    // переписать эту хуйню
    const defaultStatsJson = fs.readFileSync(file, 'utf8');
    const {stats: defaultStats, settings: defaultSettings} = JSON.parse(defaultStatsJson);
    defaultSettings.isStatSendToday = true;
    defaultSettings.lastReaded = settings.lastReaded;
    fs.writeFileSync(file, JSON.stringify({settings: defaultSettings, stats: defaultStats}));
}
