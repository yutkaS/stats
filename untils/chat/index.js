import fs from "fs";
import fetch from "node-fetch";
import {file, timeToInterval, messageToTrashTalk, chat, myToken, statisticChatId} from '../constants/index.js'
import {getUserIndex} from "../data/index.js";

export const sendStat = () => {
    const statsJson = fs.readFileSync(file, 'utf8');
    fetch(`https://api.telegram.org/bot${myToken}/sendMessage?chat_id=${statisticChatId}&text=${statsJson}&parse_mode=Markdown`)
        .then(console.log)
        .catch(console.log);
};

export const sendMessage = (text) => {
    fetch(`https://api.telegram.org/bot${myToken}/sendMessage?chat_id=${chat}&text=${text}&parse_mode=Markdown`)
        .then(console.log)
        .catch(console.log);
};

export const sendPhoto = (photo, caption) => {
    fetch(`https://api.telegram.org/bot${myToken}/sendPhoto?chat_id=${chat}&photo=${photo}&caption=${caption}&parse_mode=Markdown`)
        .then(console.log)
        .catch(console.log);
};

export const readMessage = (message) => {
    const readerId = message.from.id;
    const replyBy = message['reply_to_message'];
    const forwardDate = message['forward_date'];
    const photo = message.photo;
    const sticker = message.sticker;
    const video = message.video;
    const voice = message.voice;
    const text = message.text;
    const caption = message.caption;

    const statsJson = fs.readFileSync(file, 'utf8');
    const {stats, settings} = JSON.parse(statsJson);

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
    fs.writeFileSync(file, JSON.stringify({stats, settings}), 'utf8');
};

const stopTrashTalk = () => {
    const statsJson = fs.readFileSync(file, 'utf8');
    const {settings, stats} = JSON.parse(statsJson);
    settings.trashTalkActive = false;
    // написать метод для работы с переменными в бд
    fs.writeFileSync(file, JSON.stringify({settings, stats}), 'utf8');
}

const startTrashTalk = () => {
    const statsJson = fs.readFileSync(file, 'utf8');
    const {settings, stats} = JSON.parse(statsJson);

    settings.hasTrashTalkToday = true;
    settings.trashTalkActive = true;

    fs.writeFileSync(file, JSON.stringify({settings, stats}), 'utf8');
}

export const checkTrashTalk = (updates) => {
    const statsJson = fs.readFileSync(file, 'utf8');
    const {settings, stats} = JSON.parse(statsJson);

    const updatesCount = updates.length;

    if (updates < messageToTrashTalk) return;

    const lastUpdate = updates[updatesCount - 1];
    const oldUpdate = updates[updatesCount - messageToTrashTalk];

    const lastMessage = lastUpdate.message || lastUpdate["edited_message"];
    const oldMessage = oldUpdate.message || oldUpdate["edited_message"];

    if (
        (lastMessage.date - oldMessage.date) * 1000 < timeToInterval &&
        Date.now() / 1000 - lastMessage.date < 60 * 5 &&
        !settings.trashTalkActive
    ) {
        // sendPhoto("AgACAgIAAxkBAAIOPWMOM9M35sRxKmGVGgt7rMVS_uONAAJ6wjEbXeRxSHOYkcSMGvKUAQADAgADeAADKQQ", 'Товарищи! Вы начали дисскуссию, партия поощряет вас!')
        sendPhoto('AgACAgIAAxkBAAI_32NFb9HudBKOSZu6EfrakBUu3VTyAAJ_vjEb0rkoShYI7huPcMs_AQADAgADeAADKgQ', 'Товариші! Ви розпочали дискусію, партія заохочує вас!🇺🇦🇺🇦🇺🇦')
        startTrashTalk();
    }
    else stopTrashTalk()
};

export const getUpdates = async () => fetch(`https://api.telegram.org/bot${myToken}/getUpdates?offset=-100&timeout=10&allowed_updates=[message]`)
    .then((e) => e.json())
    .then(({result}) => result);
