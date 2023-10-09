import {getData} from "../../else/index.js";

export const getUserIndex = (id) => {
    const {stats} = getData();
    let index = null;

    stats.forEach((e, i) => {
        if (e.id === id) index = i;
    });

    return index;
};
