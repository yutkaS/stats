import {getPoints} from "./getPoints.js";
import {getData} from "../../../else/index.js";

export const getUsersPoints = () => {
    const {stats} = getData();

    return stats.map((stat) => ({
        points: getPoints(stat),
        name: stat.name,
        id: stat.id,
    }))
}
