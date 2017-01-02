const models = require('../../config/db.config.js');

module.exports = {
  expectedScoreP1: function (eloP1, eloP2) {
<<<<<<< HEAD
    return 1 / (1 + Math.pow(10, ((eloP2 - eloP1) / 400)));
=======
    return 1 / (1 + 10 * ((eloP2 - eloP1) / 400));
>>>>>>> bd02c9e03528da9c84f7644c169baa6b58fda8e8
  },

  adjustedELO: function (currElo, expectedScore, actualScore) {
    let k = 32; // A higher k factor means higher rating volatility.
    return currElo + k * (actualScore - expectedScore);
  },

  changeInELO: function (currElo, expectedScore, actualScore) {
    let k = 32; // A higher k factor means higher rating volatility.
    return k * (actualScore - expectedScore);
  },

  updateELOs: function (fbId1, elo1, fbId2, elo2) {
    models.User.findOne({
      where: {
        auth: fbId1
      }
    })
    .then(result => {
      if (result) {
        result.update({
          ELO: elo1
        })
        .then(() => {
          console.log('User' + fbId1 + 'ELO has been successfully updated');
        });
      } else {
        console.log(fbId1 + 'not found.');
      }
    })
    .catch(err => {
      console.log(err);
      throw err;
    });

    models.User.findOne({
      where: {
        auth: fbId2
      }
    })
    .then(result => {
      if (result) {
        result.update({
          ELO: elo2
        })
        .then(() => {
          console.log('User' + fbId2 + 'ELO has been successfully updated');
        });
      } else {
        console.log(fbId2 + 'not found.');
      }
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
  }
};
