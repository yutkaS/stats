import * as path from "path";

export const myToken = '5565355473:AAHyGBFLqGzUFulnx558GYiyzZ6LN_XTbk0';
export const chatIdTest = -787142727;
export const bottleChatId = -1001537695968;
export const statisticChatId = -643353109;
export const messageToTrashTalk = 20;

export const isProd = false;
export const timeToInterval = isProd ? 1000 * 60 * 5 : 5000;
export const chat = isProd ? bottleChatId : chatIdTest;
export const defaultStage = `{"settings":{"trashTalkActive": false, "isStatSendToday": false, "hasTrashTalkToday": false, "isProd": ${isProd}}, "stats":[]}`;

const fileName = isProd ? "stats.json" : "test.json";
export const file = path.resolve(fileName);