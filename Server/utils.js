const rand = (min, max) => {
    return Math.floor(min + Math.random() * (max + 1 - min));
};

const gameInfo = (userId) => {
    if (!userId) {
        userId = Math.random().toString(16).slice(2, 8);
    }

    return {
        userId,
        width: rand(10, 20),
        height: rand(4, 10),
        maxMoves: rand(8, 20),
        target: [rand(0, 255), rand(0, 255), rand(0, 255)],
    };
};

module.exports = {
    gameInfo
}