import fs from "fs";
import {file} from "../../constants/index.js";
import {getData} from "../../else/index.js";

export const addUser = (user) => {
    const {stats, settings} = getData();

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
        circlesCount: 0,
        circlesDuration: 0,
    };

    stats.push(newUser);
    fs.writeFileSync(file, JSON.stringify({settings, stats}), 'utf8');
};
