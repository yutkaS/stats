import {sendStat, readMessage, checkTrashTalk, getUpdates} from './untils/chat/index.js';
import {timeToInterval, chat} from './untils/constants/index.js'
import {getUserIndex, init, addUser} from "./untils/data/index.js";
import {handleDayEnd} from "./untils/events/index.js";


let lastReaded = 0;

const update = (update) => {

    const message = update.message || update["edited_message"];
    if (message['message_id'] <= lastReaded) return;

    const chatId = message.chat.id;
    if (chatId !== chat) return
    console.log(message, "прочитанное сообщение");

    const user = message.from;

    if (getUserIndex(user.id) === null) addUser(user);
    readMessage(message);

    lastReaded = message['message_id'];
};

const handleInterval = async () => {
    const updates = await getUpdates();
    checkTrashTalk(updates);
    updates.map(update);
    sendStat();
     handleDayEnd();
};

init();
setInterval(handleInterval, timeToInterval);

