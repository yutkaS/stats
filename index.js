import {sendStat, readMessage, checkTrashTalk, getUpdates} from './untils/chat/index.js';
import {timeToInterval, chat, file} from './untils/constants/index.js'
import {getUserIndex, init, addUser} from "./untils/data/index.js";
import {handleDayEnd} from "./untils/events/index.js";
import fs from "fs";



const update = (update) => {
    const infoJson = fs.readFileSync(file, 'utf8')
    const {settings} = JSON.parse(infoJson);

    const message = update.message || update["edited_message"];
    if (message['message_id'] <= settings.lastReaded) return;

    const chatId = message.chat.id;
    if (chatId !== chat) return
    console.log(message, "прочитанное сообщение");

    const user = message.from;

    if (getUserIndex(user.id) === null) addUser(user);
    readMessage(message);

    // перепиать эту хуйню
    const updatedInfoJson = fs.readFileSync(file, 'utf8')
    const {settings: updatedSettings, stats} = JSON.parse(updatedInfoJson);
    updatedSettings.lastReaded = message['message_id'];
    fs.writeFileSync( file, JSON.stringify({settings: updatedSettings, stats}), "utf8");
};

const handleInterval = async () => {
    const statsJson = fs.readFileSync(file, 'utf8');
    const {settings, stats} = JSON.parse(statsJson);

    const updates = await getUpdates();
    checkTrashTalk(updates);
    updates.map(update);
    sendStat();

    // переписать эту хуйню
    if (new Date().getHours() > 19 && !settings.isStatSendToday) handleDayEnd();
    if (new Date().getHours() < 3) {
        settings.hasTrashTalkToday = false;
        fs.writeFileSync(file, JSON.stringify({settings, stats}), 'utf8');
    }
};
init();
handleInterval()
setInterval(handleInterval, timeToInterval);

