import fs from "fs";
import {chat, file, myToken, statisticChatId} from "../../constants/index.js";
import fetch from "node-fetch";
import {getUserIndex} from "../../data/index.js";
import {getData} from "../../else/index.js";
import {checkCommand} from "../commands/index.js";

export const getUserTag = (name, id) => {
    return `[${name}](tg://user?id=${id})`
};

export const sendStat = () => {
    const statsJson = fs.readFileSync(file, 'utf8');
    fetch(`https://api.telegram.org/bot${myToken}/sendMessage?chat_id=${statisticChatId}&text=${statsJson}&parse_mode=Markdown`)
    // .then(console.log)
    // .catch(console.log);
};

export const sendMessage = (text) => {
    fetch(`https://api.telegram.org/bot${myToken}/sendMessage?chat_id=${chat}&text=${text}&parse_mode=Markdown`)
    // .then(console.log)
    // .catch(console.log);
};

export const sendPhoto = (photo, caption) => {
    fetch(`https://api.telegram.org/bot${myToken}/sendPhoto?chat_id=${chat}&photo=${photo}&caption=${caption}&parse_mode=Markdown`)
    // .then(console.log)
    // .catch(console.log);
};

export const readMessage = (message) => {

    if (checkCommand(message)) return;

    const readerId = message.from.id;
    const replyBy = message['reply_to_message'];
    const forwardDate = message['forward_date'];
    const video = message.video;
    const voice = message.voice;
    const text = message.text;
    const caption = message.caption;
    const circle = message.video_note;
    const photo = message.photo;
    const sticker = message.sticker;

    const {stats, settings} = getData();

    const user = stats[getUserIndex(readerId)];

    user.messagesCount += 1;
    if (text) user.lettersCount += text.length;
    if (caption) user.lettersCount += caption.length;
    if (sticker) user.stickersCount += 1;
    if (forwardDate) user.forwardsCount += 1;
    if (video) user.videosCount += 1;
    if (voice) user.voicesCount += 1;
    if (photo) user.photosCount += 1;
    if (replyBy) user.repliesCount += 1;
    if (circle) {
        user.circlesCount += 1;
        user.circlesDuration += circle.duration;
    }

    fs.writeFileSync(file, JSON.stringify({stats, settings}), 'utf8');
};

export const getUpdates = async () => fetch(`https://api.telegram.org/bot${myToken}/getUpdates?offset=-100&timeout=10&allowed_updates=[message]`)
    .then((e) => e.json())
    .then(({result}) => result);
