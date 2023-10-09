import fs from "fs";
import {file, messageToTrashTalk, timeToInterval} from "../../constants/index.js";
import {sendPhoto} from '../index.js';
import {getData} from "../../else/index.js";

const stopTrashTalk = () => {
    const {settings, stats} = getData();
    settings.trashTalkActive = false;
    // написать метод для работы с переменными в бд
    fs.writeFileSync(file, JSON.stringify({settings, stats}), 'utf8');
}

const startTrashTalk = () => {
    const {settings, stats} = getData();

    settings.hasTrashTalkToday = true;
    settings.trashTalkActive = true;

    fs.writeFileSync(file, JSON.stringify({settings, stats}), 'utf8');

    // sendPhoto("AgACAgIAAxkBAAIOPWMOM9M35sRxKmGVGgt7rMVS_uONAAJ6wjEbXeRxSHOYkcSMGvKUAQADAgADeAADKQQ", 'Товарищи! Вы начали дисскуссию, партия поощряет вас!')
    sendPhoto('AgACAgIAAxkBAAI_32NFb9HudBKOSZu6EfrakBUu3VTyAAJ_vjEb0rkoShYI7huPcMs_AQADAgADeAADKgQ', 'Товариші! Ви розпочали дискусію, партія заохочує вас!🇺🇦🇺🇦🇺🇦')
}

export const checkTrashTalk = (updates) => {
    const {settings} = getData();
    const updatesCount = updates.length;

    if (updates < messageToTrashTalk) return;

    const lastUpdate = updates[updatesCount - 1];
    const oldUpdate = updates[updatesCount - messageToTrashTalk];

    // если чатик пустой, то не нужно проверять на треш толк
    if (!lastUpdate || !oldUpdate) return;

    const lastMessage = lastUpdate.message || lastUpdate["edited_message"];
    const oldMessage = oldUpdate.message || oldUpdate["edited_message"];

    if (
        (lastMessage.date - oldMessage.date) * 1000 < timeToInterval &&
        Date.now() / 1000 - lastMessage.date < 60 * 5 &&
        !settings.trashTalkActive
    ) {
        startTrashTalk();
    }
    else stopTrashTalk()
};
