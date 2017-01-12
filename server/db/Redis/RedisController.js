
const redClient = require('../../config/redis.config.js');
const Promise = require('bluebird');

module.exports = {

  /**
   * Return the prompts for the specified level,
   * if not level is given then return all prompts
   */
  getPrompts: (level) => {
    if (level) {
      return redClient.smembers(`L${level}P`);
    } else {
      // return redClient.sunion(`L1P`, `L2P`, `L3P`, `L4P`, `L5P`);
      return redClient.sunion(`L1P`, `L2P`, `L3P`);
    }
  },

  // Deprecated
  checkAnswer: (prompt, answer) => {
    let tmp = answer;
    // console.log('\u{1F4AA}' === '💪');
    console.log('checking answer....', prompt, tmp);
    return redClient.smembers(`PTA:${prompt}`)
      .then(answers => {
        console.log('ANSWERS:', answers);

        for (let a of answers) {
          console.log(a, tmp, a === tmp);
          if (a === tmp) {
            return true;
          }
        }
        return false;
      })
      .catch(err => {
        throw err;
      });
  },

  getAnswers: (prompt) => {
    return redClient.smembers(`PTA:${prompt}`)
      .catch(err => {
        throw err;
      });
  },

  getAllAnswers: (prompts) => {
    let solutions = {};

    return Promise.map(prompts, (prompt) => {
      solutions[prompt] = {};
      return redClient.smembers(`PTA:${prompt}`).then(answers => {
        for (let answer of answers) {
          solutions[prompt][answer] = true;
        }
      });
    }).then(() => solutions);
  },

  getCommends: () => {
    return redClient.smembers(`Commends`)
      .catch(err => {
        throw err;
      });
  },

  getInsults: () => {
    return redClient.smembers(`Insults`)
      .catch(err => {
        throw err;
      });
  },

  getAdminsCache: (req, res, next) => {
    redClient.smembers(`Admins`)
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      res.json(err);
      throw err;
    });
  },

  getUsersCache: (req, res, next) => {
    redClient.smembers(`allUsers`)
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      res.json(err);
      throw err;
    });
  }

};
