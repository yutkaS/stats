import {getUserTag, sendMessage} from "../messages/index.js";
import {getPoints, getUserIndex} from "../../data/index.js";
import {getData} from "../../else/index.js";

export const checkCommand = (messageData) => {
    const message = messageData.text;
    if (!message) return false
    if (message[0] !== '/') return false

    const command = message.slice(1);
    const senderId = messageData.from.id;
    const {stats} = getData();

    const sender = stats[getUserIndex(senderId)];

    switch (command) {
        case 'getStats':
            const userTag = getUserTag(sender.name, sender.id);
            const points = getPoints(stats[0]);
            sendMessage(`${userTag}, у тебя ${points} прокоинов!`);
    }
    return true;
}