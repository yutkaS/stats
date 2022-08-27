import fetch from 'node-fetch';
import fs from 'fs';

// константы
const myToken = '5565355473:AAHyGBFLqGzUFulnx558GYiyzZ6LN_XTbk0';
const chatIdTest = '-1001565652407';
const messageToTrashTalk = 20;
const timeToTrashTalk = 60 * 5;

const sendMessage = async (text) => fetch(`https://api.telegram.org/bot${myToken}/sendMessage?chat_id=${chatIdTest}&text=${text}`);

const getUpdates = async () => fetch(`https://api.telegram.org/bot${myToken}/getUpdates?offset=-100`)
    .then((e) => e.json())
    .then(({result}) => result);

// счетчик последнего обработанного сообщения
let lastReaded = 0;

// получить индекс юзера в главном массиве
const getUserIndex = (id) => {
    const statsJson = fs.readFileSync('./stats.json', 'utf8');
    const stats = JSON.parse(statsJson);
    let index = null;

    stats.forEach((e, i) => {
        if (e.id === id) index = i;
    });

    return index;
};

//добавить юзера
const addUser = (id, name) => {
    const statsJson = fs.readFileSync('./stats.json', 'utf8');
    const stats = JSON.parse(statsJson);

    const newUser = {
        id,
        name,
        lettersCount: 0,
        messagesCount: 0,
        repliesCount: 0,
        forwardsCount: 0,
        photosCount: 0,
        stickersCount: 0,
        voicesCount: 0,
        videosCount: 0,
    };

    stats.push(newUser);
    fs.writeFileSync('./stats.json', JSON.stringify(stats), 'utf8');
};

//закончить трешток
const stopTrashTalk = () => {
    const statsJson = fs.readFileSync('./stats.json', 'utf8');
    const stats = JSON.parse(statsJson);

    stats[0].trashTalkActive = false;

    fs.writeFileSync('./stats.json', JSON.stringify(stats), 'utf8');
}

//начать трешток
const startTrashTalk = () => {
    const statsJson = fs.readFileSync('./stats.json', 'utf8');
    const stats = JSON.parse(statsJson);

    stats[0].trashTalkActive = true;

    fs.writeFileSync('./stats.json', JSON.stringify(stats), 'utf8');
}


// проверить нужен ли треш ток
const checkTrashTalk = (updates) => {
    const updatesCount = updates.length;

    if (messageToTrashTalk > updatesCount) return;
    if (
        (updates[updatesCount - 1].message.date - updates[updatesCount - messageToTrashTalk].message.date) < timeToTrashTalk &&
        Date.now() / 1000 - updates[updatesCount - 1].message.date < 60
    ) startTrashTalk();
    else stopTrashTalk()
};

// обработчик каждого сообщения
const readMessage = (message) => {

    const readerId = message.from.id;
    const replyBy = message['reply_to_message'];
    const forwardDate = message['forward_date'];
    const photo = message.photo;
    const sticker = message.sticker;
    const video = message.video;
    const voice = message.voice;
    const text = message.text;
    const caption = message.caption;

    const statsJson = fs.readFileSync('./stats.json', 'utf8');
    const stats = JSON.parse(statsJson);

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

    fs.writeFileSync('./stats.json', JSON.stringify(stats), 'utf8');
};

// обработчик каждого апдейта
const update = (update) => {
    const message = update.message;
    const fromId = message.from.id;
    const fromName = message.from['first_name'];

    if (message['message_id'] <= lastReaded) return;

    if (getUserIndex(fromId) === null) addUser(fromId, fromName);
    console.log(message);
    readMessage(message);

    lastReaded = message['message_id'];
};

// интервал
const handleInterval = async () => {
    const statsJson = fs.readFileSync('./stats.json', 'utf8');

    const updates = await getUpdates();
    checkTrashTalk(updates);
    updates.map(update);

    await sendMessage(statsJson);
};

fs.writeFileSync("stats.json", `[{"trashTalkActive": "false"}]`, 'utf8');

setInterval(handleInterval, 60000 * 20);

