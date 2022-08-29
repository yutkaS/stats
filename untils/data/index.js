import fs from "fs";
import {file, defaultStage} from '../constants/index.js';

export const init = () => {
    if (!fs.existsSync(file)) fs.unlinkSync(file);
    fs.appendFileSync(file, defaultStage, 'utf8');
}

export const getUserIndex = (id) => {
    const statsJson = fs.readFileSync(file, 'utf8');
    const {stats} = JSON.parse(statsJson);
    let index = null;

    stats.forEach((e, i) => {
        if (e.id === id) index = i;
    });

    return index;
};

export const addUser = (user) => {
    const statsJson = fs.readFileSync(file, 'utf8');
    const {stats, settings} = JSON.parse(statsJson);

    const newUser = {
        id: user.id,
        name: user['first_name'],
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
    fs.writeFileSync(file, JSON.stringify({settings, stats}), 'utf8');
};
