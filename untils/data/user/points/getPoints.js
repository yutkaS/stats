export const getPoints = (stat) => {
    let points = 0;
    // переписать эту хуйню
    if (stat.stickersCount) points += stat.stickersCount * 2;
    if (stat.photosCount) points += stat.photosCount * 2;
    if (stat.messagesCount) points += stat.messagesCount;
    if (stat.lettersCount) points += stat.lettersCount * 0.05
    if (stat.voicesCount) points += stat.voicesCount * -10;
    if (stat.circlesDuration) points += stat.circlesDuration * 0.5

    return points;
};
