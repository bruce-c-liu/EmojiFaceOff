module.exports = {
  expectedScoreP1: function (eloP1, eloP2) {
    return 1 / (1 + 10 ** ((eloP2 - eloP1) / 400));
  },

  adjustedElo: function (currElo, expectedScore, actualScore) {
    let k = 32; // A higher k factor means higher rating volatility.
    return currElo + k * (actualScore - expectedScore);
  }
};
